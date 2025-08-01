// redis/redis.module.ts
import { Module } from '@nestjs/common';
import { RedisProvider } from './redis.provider';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [RedisProvider],
  exports: [RedisProvider],
  imports: [ConfigModule],
})
export class RedisModule {}
