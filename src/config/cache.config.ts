import { CacheModuleAsyncOptions, CacheOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

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
          host: 'localhost',
          port: 6379,
        },
      }),
    };
  }
}
