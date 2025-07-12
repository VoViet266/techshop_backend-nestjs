// redis/redis.provider.ts
import Redis from 'ioredis';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const RedisProvider: Provider = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    return new Redis({
      //   host: configService.get<string>('REDIS_HOST'),
      //   port: configService.get<number>('REDIS_PORT'),
      //   username: configService.get<string>('REDIS_USERNAME'),
      //   password: configService.get<string>('REDIS_PASSWORD'),
      host: 'redis-17023.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com',
      port: 17023,
      username: 'default',
      password: 'DQvsseSpWUyT5hXJhzcTums8aRwgxdpH',
    });
  },
};
