import { RedisModuleAsyncOptions, RedisSingleOptions } from '@nestjs-modules/ioredis';

export default class RedisConfig {
  static getConfig(): RedisSingleOptions {
    return {
      type: 'single',
      url: 'redis://localhost:6379',
      options: {
        db: 0,
      },
    };
  }

  static redisAsyncOptions: RedisModuleAsyncOptions = {
    useFactory: async () => RedisConfig.getConfig(),
  };
}
