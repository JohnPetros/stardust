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

  async set(key: string, value: string | number, options?: CacheOptions): Promise<void> {
    const parsedValue = String(value)

    if (options?.expiresAt) {
      await this.redis.set(key, parsedValue, {
        pxat: options.expiresAt.getTime(),
      })
      return
    }
    await this.redis.set(key, parsedValue)
  }

  async delete(key: string): Promise<void> {
    await this.redis.del(key)
  }

  async popListItem(key: string): Promise<string | null> {
    const data = await this.redis.lpop<string>(key)
    if (!data) return null
    return data
  }
}
