import { CacheModuleAsyncOptions, CacheOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { env } from './env-configuration.config';

export class CacheConfig {
  static getCacheConfigAsync(): CacheModuleAsyncOptions {
    return {
      isGlobal: true,
      useFactory: async () => await CacheConfig.getCacheOptions(),
    };
  }
  static async getCacheOptions(): Promise<CacheOptions> {
    return {
      store: await redisStore({
        socket: {
          host: env.REDIS_HOST,
          port: env.REDIS_PORT,
        },
      }),
    };
  }
}
