import IORedis from 'ioredis'

import type { CacheProvider, CacheOptions } from '@stardust/core/global/interfaces'
import { ENV } from '@/constants/env'
import { buildRedisOptions } from './buildRedisOptions'

export class IORedisCacheProvider implements CacheProvider {
  private static redis: IORedis | null = null
  private static connectPromise: Promise<IORedis> | null = null

  private createRedis(): IORedis {
    const options = buildRedisOptions(ENV.redisUrl)

    const redis = new IORedis(options)

    redis.on('ready', () => {
      console.info('[Redis] Ready')
    })

    redis.on('error', (error) => {
      console.error('[Redis] Error:', error.message)
    })

    redis.on('end', () => {
      console.warn('[Redis] Connection ended')

      if (IORedisCacheProvider.redis === redis) {
        IORedisCacheProvider.redis = null
      }
    })

    return redis
  }

  private async getRedis(): Promise<IORedis> {
    if (!IORedisCacheProvider.redis || IORedisCacheProvider.redis.status === 'end') {
      IORedisCacheProvider.redis = this.createRedis()
    }

    const redis = IORedisCacheProvider.redis

    if (redis.status === 'ready') {
      return redis
    }

    if (!IORedisCacheProvider.connectPromise) {
      IORedisCacheProvider.connectPromise = redis
        .connect()
        .then(() => redis)
        .catch((error) => {
          redis.disconnect()

          if (IORedisCacheProvider.redis === redis) {
            IORedisCacheProvider.redis = null
          }

          throw error
        })
        .finally(() => {
          IORedisCacheProvider.connectPromise = null
        })
    }

    return IORedisCacheProvider.connectPromise
  }
  private logError(operation: string, error: unknown): void {
    const message = error instanceof Error ? error.message : String(error)
    console.error(`[Redis] ${operation} failed:`, message)
  }

  async get(key: string): Promise<string | null> {
    try {
      const redis = await this.getRedis()
      return await redis.get(key)
    } catch (error) {
      this.logError('GET', error)
      return null
    }
  }

  async set(key: string, value: string | number, options?: CacheOptions): Promise<void> {
    try {
      const redis = await this.getRedis()
      const parsedValue = String(value)

      if (options?.expiresAt) {
        await redis.set(key, parsedValue, 'PXAT', options.expiresAt.getTime())
        return
      }

      await redis.set(key, parsedValue)
    } catch (error) {
      this.logError('SET', error)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      const redis = await this.getRedis()
      await redis.del(key)
    } catch (error) {
      this.logError('DELETE', error)
    }
  }

  async popListItem(key: string): Promise<string | null> {
    try {
      const redis = await this.getRedis()
      return await redis.lpop(key)
    } catch (error) {
      this.logError('LPOP', error)
      return null
    }
  }
}
