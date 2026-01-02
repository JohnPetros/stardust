import { Redis } from '@upstash/redis'

import type { CacheProvider, CacheOptions } from '@stardust/core/global/interfaces'

export class UpstashCacheProvider implements CacheProvider {
  private redis: ReturnType<typeof Redis.fromEnv>

  constructor() {
    this.redis = Redis.fromEnv()
  }

  async get<Data = string>(key: string): Promise<Data | null> {
    const data = await this.redis.get<Data>(key)
    if (!data) return null
    return data
  }

  async set<Data>(key: string, value: Data, options?: CacheOptions): Promise<void> {
    if (options?.expiresAt) {
      await this.redis.set(key, value, {
        exat: options.expiresAt.getTime(),
      })
      return
    }
    await this.redis.set(key, value)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }
}
