import { RedisModuleAsyncOptions, RedisSingleOptions } from '@nestjs-modules/ioredis';
import { env } from './env-configuration.config';

export default class RedisConfig {
  static getConfig(): RedisSingleOptions {
    return {
      type: 'single',
      url: `redis://${env.REDIS_HOST}:${env.REDIS_PORT}`,
      options: {
        db: 0,
      },
    };
  }

  static redisAsyncOptions: RedisModuleAsyncOptions = {
    useFactory: async () => RedisConfig.getConfig(),
  };
}
