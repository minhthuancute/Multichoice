import { Controller, Get } from '@nestjs/common';

import { redisService } from './redis.service';

@Controller()
export class redisController {
  constructor(private readonly redisService: redisService) {}
  @Get('test/test')
  async getNumber(): Promise<any> {
    const randomNumDbs = Math.floor(Math.random() * Date.now());
    console.log(randomNumDbs);
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
