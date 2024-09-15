import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleAsyncOptions, JwtModuleOptions } from '@nestjs/jwt';
import { env } from './env-configuration.config';

export default class JwtConfig {
  static getJwtConfig(configService: ConfigService): JwtModuleOptions {
    return {
      global: true,
      secret: env.JWT_ACCESS_TOKEN_SECRET,
      signOptions: {
        expiresIn: env.JWT_ACCESS_TOKEN_EXPIRE_IN_SECONDS,
      },
    };
  }
}

export const jwtConfigAsync: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> => JwtConfig.getJwtConfig(configService),
  inject: [ConfigService],
};
