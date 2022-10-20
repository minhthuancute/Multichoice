import { CacheModule, Module } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import configuration from '../config/configuration';
import { redisController } from './redis.controller';
import { RedisService } from './redis.service';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: configuration().redis.host,
      port: configuration().redis.port,
    }),
  ],
  providers: [RedisService],
  exports: [RedisService],
  controllers: [redisController],
})
export class RedisModule {}
