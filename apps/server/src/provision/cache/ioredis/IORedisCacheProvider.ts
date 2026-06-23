import IORedis from 'ioredis'

import type { CacheProvider, CacheOptions } from '@stardust/core/global/interfaces'
import { ENV } from '@/constants/env'

export class IORedisCacheProvider implements CacheProvider {
  private static redis: IORedis | null = null

  private getRedis(): IORedis {
    if (IORedisCacheProvider.redis) return IORedisCacheProvider.redis

    IORedisCacheProvider.redis = new IORedis(ENV.redisUrl)
    return IORedisCacheProvider.redis
  }

  async get(key: string): Promise<string | null> {
    const redis = this.getRedis()
    const data = await redis.get(key)
    if (!data) return null
    return data
  }

  async set(key: string, value: string | number, options?: CacheOptions): Promise<void> {
    const redis = this.getRedis()
    const parsedValue = String(value)

    if (options?.expiresAt) {
      await redis.set(key, parsedValue, 'PXAT', options.expiresAt.getTime())
      return
    }

    await redis.set(key, parsedValue)
  }

  async delete(key: string): Promise<void> {
    const redis = this.getRedis()
    await redis.del(key)
  }

  async popListItem(key: string): Promise<string | null> {
    const redis = this.getRedis()
    const data = await redis.lpop(key)
    if (!data) return null
    return data
  }
}
