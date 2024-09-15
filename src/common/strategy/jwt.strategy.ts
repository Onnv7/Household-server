import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthContextService } from '../../service/auth-context.service';
import { env } from '../../config/env-configuration.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    private readonly configService: ConfigService,
    private readonly authContextService: AuthContextService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  async validate(payload: any) {
    this.authContextService.setUser({ id: payload.id, email: payload.email, role: payload.role });
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
