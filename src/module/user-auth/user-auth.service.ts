import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  LoginUserRequest,
  RegisterUserRequest,
} from './payload/user-auth.request';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../entity/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { plainToInstance } from 'class-transformer';
import { LoginUserResponse } from './payload/user-auth.response';
import { CustomError } from '../../common/model/response-api';
import { ErrorResponseData } from '../../constant/response.constant';
import { JwtService } from '@nestjs/jwt';
import { AppService } from '../../app.service';
import { Role } from '../../common/enum';

@Injectable()
export class UserAuthService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly jwtService: JwtService,
  ) {}
  async registerUser(body: RegisterUserRequest): Promise<void> {
    const hashPassword = await bcrypt.hash(body.password, 7);

    const user = this.userRepository.create({
      ...body,
      password: hashPassword,
      role: Role.ROLE_USER,
    });

    await this.userRepository.save(user);
  }

  async loginUser(body: LoginUserRequest): Promise<LoginUserResponse> {
    const userEntity = await this.userRepository.findOneBy({
      username: body.username,
    });

    if (
      userEntity &&
      (await bcrypt.compare(body.password, userEntity.password))
    ) {
      const payload = {
        id: userEntity.id,
        username: userEntity.username,
        role: userEntity.role,
      };
      return {
        userId: userEntity.id,
        accessToken: this.jwtService.sign(payload),
      };
    } else {
      throw new CustomError(ErrorResponseData.CREDENTIAL_WRONG);
    }
  }
}
