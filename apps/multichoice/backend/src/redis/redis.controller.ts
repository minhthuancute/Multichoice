import { Controller, Get } from '@nestjs/common';

import { RedisService } from './redis.service';

@Controller()
export class redisController {
  constructor(private readonly redisService: RedisService) {}
  @Get('test/test')
  async getNumber(): Promise<any> {
    const randomNumDbs = Math.floor(Math.random() * Date.now());
    const val = await this.redisService.get('number');
    if (val) {
      return {
        data: val,
        FromRedis: 'this is loaded from redis cache',
      };
    }
    if (!val) {
      await this.redisService.set('number', 'quada', 10);
      return {
        data: randomNumDbs,
        FromRandomNumDbs: 'this is loaded from randomNumDbs',
      };
    }
  }
}
