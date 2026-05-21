import Redis from 'ioredis'

import type { CacheOptions, CacheProvider } from '@stardust/core/global/interfaces'
import { ENV } from '@/constants/env'

export class RedisCacheProvider implements CacheProvider {
  private readonly redis: Redis

  constructor() {
    this.redis = new Redis(ENV.redisUrl, { tls: {} })
  }

  async get(key: string): Promise<string | null> {
    const data = await this.redis.get(key)

    if (!data) return null

    return data
  }

  async set(key: string, value: string | number, options?: CacheOptions): Promise<void> {
    const parsedValue = String(value)

    if (options?.expiresAt) {
      await this.redis.set(key, parsedValue, 'PXAT', options.expiresAt.getTime())
      return
    }

    await this.redis.set(key, parsedValue)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async popListItem(key: string): Promise<string | null> {
    const data = await this.redis.lpop(key)

    if (!data) return null

    return data
  }
}
