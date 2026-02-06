import { Redis } from '@upstash/redis'

import type { CacheProvider, CacheOptions } from '@stardust/core/global/interfaces'

export class UpstashCacheProvider implements CacheProvider {
  private redis: ReturnType<typeof Redis.fromEnv>

  constructor() {
    this.redis = Redis.fromEnv()
  }

  async get(key: string): Promise<string | null> {
    const data = await this.redis.get<string>(key)
    if (!data) return null
    return data
  }

  async set(key: string, value: string, options?: CacheOptions): Promise<void> {
    if (options?.expiresAt) {
      await this.redis.set(key, value, {
        pxat: options.expiresAt.getTime(),
      })
      return
    }
    await this.redis.set(key, value)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async getListItem(key: string, itemIndex: number): Promise<string | null> {
    const data = await this.redis.lindex(key, itemIndex)
    if (!data) return null
    return data
  }
}
