import { Injectable, Logger } from '@nestjs/common';
import {
  GoogleAuthHeaders,
  LoginUserRequest,
  LoginWithZaloRequest,
  RegisterUserRequest,
  SendCodeRequest,
  UpdatePasswordRequest,
  VerifyEmailCodeRequest,
} from './payload/user-auth.request';
import { UserEntity } from '../../entity/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserResponse, RefreshTokenResponse } from './payload/user-auth.response';
import { AppError } from '../../common/model/response-api';
import { ErrorResponseData } from '../../constant/response.constant';
import { JwtService } from '@nestjs/jwt';
import { Role } from '../../common/enum';
import { UserRepository } from '../../repository/user.repository';
import { MailerService } from '@nest-modules/mailer';
import { MailVerificationRepository } from '../../repository/mail-verification.repository';
import { DateTimeUtil } from '../../util/datetime.util';
import { NumberUtil } from '../../util/number.util';
import { Transactional } from 'typeorm-transactional';
import { env } from '../../config/env-configuration.config';
import { ZaloAuthService } from '../../service/zalo-social/zalo-auth.service';
import { OAuth2Client } from 'google-auth-library';
import { generateRandomPassword } from '../../util/string.util';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { AuthContextService } from '../../service/auth-context.service';
import { TokenAuthService } from '../../service/token-auth/token-auth.service';
import { PayloadToken } from '../../service/token-auth/token-auth.model';

@Injectable()
export class UserAuthService {
  private oauth2Client: OAuth2Client;
  private readonly logger = new Logger(UserAuthService.name);
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly userRepository: UserRepository,
    private readonly mailVerificationRepository: MailVerificationRepository,
    // private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly zaloAuthService: ZaloAuthService,
    private readonly authContextService: AuthContextService,
    private readonly tokenAuthService: TokenAuthService,
  ) {
    this.oauth2Client = new OAuth2Client(env.GOOGLE_CLIENT_ID, env.GOOGLE_CLIENT_SECRET);
  }
  @Transactional()
  async registerUser(body: RegisterUserRequest): Promise<void> {
    const userEntity = await this.userRepository.findOneBy({ email: body.email });
    if (userEntity) {
      throw new AppError(ErrorResponseData.EMAIL_EXISTED);
    }
    const emailVerification = await this.mailVerificationRepository.findOneBy({ email: body.email, token: body.token });

    if ((emailVerification && !emailVerification.isVerified) || !emailVerification) {
      throw new AppError(ErrorResponseData.FLOW_INCORRECT);
    }

    await this.mailVerificationRepository.remove(emailVerification);
    const hashPassword = await bcrypt.hash(body.password, env.SALT_PASSWORD);

    const user: UserEntity = this.userRepository.create({
      ...body,
      password: hashPassword,
      role: Role.ROLE_USER,
    });
    this.logger.debug('User registration');
    await this.userRepository.save(user);
  }

  async loginUser(body: LoginUserRequest): Promise<LoginUserResponse & { refreshToken: string }> {
    const userEntity = await this.userRepository.findOneBy({
      email: body.email,
    });

    if (userEntity && (await bcrypt.compare(body.password, userEntity.password))) {
      const accessTokenPayload = {
        id: userEntity.id,
        email: userEntity.email,
        role: userEntity.role,
      };

      const refreshTokenPayload: PayloadToken = {
        id: userEntity.id,
        email: userEntity.email,
        role: userEntity.role,
      };
      return {
        userId: userEntity.id,
        accessToken: this.tokenAuthService.signAccessToken(accessTokenPayload),
        refreshToken: this.tokenAuthService.signRefreshToken(refreshTokenPayload),
      };
    } else {
      throw new AppError(ErrorResponseData.CREDENTIAL_WRONG);
    }
  }

  async sendCodeToEmailRegister(body: SendCodeRequest): Promise<void> {
    const userEntity = await this.userRepository.findOneBy({ email: body.email });
    if (userEntity) {
      throw new AppError(ErrorResponseData.EMAIL_EXISTED);
    }
    const emailVerification = await this.mailVerificationRepository.findOneBy({ email: body.email });

    if (emailVerification && new Date() <= emailVerification.expiredAt) {
      throw new AppError(ErrorResponseData.FLOW_INCORRECT);
    }
    if (emailVerification) {
      await this.mailVerificationRepository.remove(emailVerification);
    }

    const code = NumberUtil.generateVerificationCode();
    // const sendResult: SentMessageInfo = await this.mailerService.sendMail({
    //   to: body.email,
    //   template: './verify-code',
    //   context: {
    //     code: code,
    //   },
    // });

    const newEmailVerification = this.mailVerificationRepository.create({
      email: body.email,
      token: code,
      expiredAt: DateTimeUtil.plusTime(new Date(), { minutes: 1, seconds: 30 }),
    });
    await this.mailVerificationRepository.save(newEmailVerification);
  }
  async verifyEmailCode(body: VerifyEmailCodeRequest) {
    const emailVerification = await this.mailVerificationRepository.findOneBy({ email: body.email });
    if (!emailVerification) {
      throw new AppError(ErrorResponseData.EMAIL_NOT_FOUND);
    }
    if (emailVerification.token !== body.token || emailVerification.expiredAt < new Date()) {
      throw new AppError(ErrorResponseData.UNAUTHORIZED);
    }

    emailVerification.isVerified = true;
    await this.mailVerificationRepository.save(emailVerification);
  }

  async updatePassword(userId: number, body: UpdatePasswordRequest) {
    const userEntity = await this.userRepository.findOneBy({ id: userId });

    if (!userEntity) {
      throw new AppError(ErrorResponseData.USER_NOT_FOUND);
    }

    if (!(await bcrypt.compare(body.oldPassword, userEntity.password))) {
      throw new AppError(ErrorResponseData.UNAUTHORIZED);
    }
    await this.userRepository.save({
      ...userEntity,
      password: await bcrypt.hash(body.newPassword, env.SALT_PASSWORD),
    });
  }
  async loginWithZalo(body: LoginWithZaloRequest) {
    const data = await this.zaloAuthService.loginZalo(body.code, body.codeVerifier);
    const userInfo = await this.zaloAuthService.getUserInformation(data.access_token);
  }

  async authByGoogle({ code, idToken }: GoogleAuthHeaders): Promise<LoginUserResponse & { refreshToken: string }> {
    if (!idToken) {
      const tokenData = await this.oauth2Client.getToken({ code: code, redirect_uri: env.GOOGLE_REDIRECT_URL });
      this.oauth2Client;
      idToken = tokenData.tokens.id_token;
    }

    const loginTicket = await this.oauth2Client.verifyIdToken({ idToken: idToken });

    const { picture, given_name, family_name, email } = loginTicket.getPayload();
    let userEntity = await this.userRepository.findOneBy({ email: email });
    if (!userEntity) {
      userEntity = this.userRepository.create({
        email: email,
        lastName: family_name,
        firstName: given_name,
        avatarUrl: picture,
        role: Role.ROLE_USER,
        password: await bcrypt.hash(generateRandomPassword(10), env.SALT_PASSWORD),
      });
      await this.userRepository.save(userEntity);
    }

    const accessTokenPayload = {
      id: userEntity.id,
      email: userEntity.email,
      role: userEntity.role,
    };

    const refreshTokenPayload = {
      id: userEntity.id,
      email: userEntity.email,
      role: userEntity.role,
    };
    const refreshToken = this.tokenAuthService.signRefreshToken(refreshTokenPayload);

    await this.saveRefreshToken(userEntity.id, refreshToken);

    return {
      userId: userEntity.id,
      accessToken: this.tokenAuthService.signAccessToken(accessTokenPayload),
      refreshToken: refreshToken,
    };
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse & { refreshToken: string }> {
    console.log('🚀 ~ UserAuthService ~ refreshToken ~ refreshToken:', refreshToken);
    const { id } = this.authContextService.getUser();
    const tokenData = await this.redis.hget(`refreshToken:${id}`, refreshToken);

    if (tokenData != null && !Number(tokenData)) {
      const payloadParse = this.tokenAuthService.verifyRefreshToken(refreshToken);

      if (!payloadParse) {
        throw new AppError(ErrorResponseData.UNAUTHORIZED);
      }

      const payload = {
        id: payloadParse.id,
        email: payloadParse.email,
        role: payloadParse.role,
      };

      const data = {
        accessToken: this.tokenAuthService.signAccessToken(payload),
        refreshToken: this.tokenAuthService.signRefreshToken(payload),
      };
      await this.saveRefreshToken(payload.id, data.refreshToken);
      return data;
    } else if (Number(tokenData)) {
      await this.redis.del(`refreshToken:${id}`);
      throw new AppError(ErrorResponseData.UNAUTHORIZED);
    } else {
      throw new AppError(ErrorResponseData.UNAUTHORIZED);
    }
  }

  async saveRefreshToken(userId: number, token: string) {
    await this.redis.hset(`refreshToken:${userId}`, token, 0);
    await this.redis.call(
      'HEXPIRE',
      `refreshToken:${userId}`,
      env.JWT_REFRESH_TOKEN_EXPIRE_IN_SECONDS,
      'FIELDS',
      '1',
      token,
    );
  }
}
