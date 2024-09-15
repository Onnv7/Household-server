import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PayloadToken } from './token-auth.model';
import { env } from '../../config/env-configuration.config';

@Injectable()
export class TokenAuthService extends JwtService {
  constructor(@Inject() private readonly jwtService: JwtService) {
    super();
  }

  signAccessToken(payload: PayloadToken) {
    return this.jwtService.sign(payload, {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRE_IN_SECONDS,
      secret: env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  signRefreshToken(payload: PayloadToken) {
    return this.jwtService.sign(payload, {
      expiresIn: env.JWT_REFRESH_TOKEN_EXPIRE_IN_SECONDS,
      secret: env.JWT_REFRESH_TOKEN_SECRET,
    });
  }

  verifyAccessToken(token: string) {
    return this.jwtService.verify(token, {
      secret: env.JWT_ACCESS_TOKEN_SECRET,
    });
  }
  verifyRefreshToken(token: string) {
    return this.jwtService.verify(token, {
      secret: env.JWT_REFRESH_TOKEN_SECRET,
    });
  }
}
