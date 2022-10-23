import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  public async get<T>(key: string): Promise<T> {
    const value: string = await this.cacheManager.get(key);
    if (!value) return null;
    const result = JSON.parse(value);
    return result;
  }

  public async set(key: string, value: any, expirTime: number) {
    return await this.cacheManager.set(key, JSON.stringify(value), {
      ttl: expirTime,
    });
  }

  public async delete(key: string) {
    return await this.cacheManager.del(key);
  }
}
