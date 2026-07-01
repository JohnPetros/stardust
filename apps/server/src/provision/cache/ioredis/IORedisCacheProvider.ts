import IORedis, { type RedisOptions } from 'ioredis'
import net from 'node:net'

import type { CacheProvider, CacheOptions } from '@stardust/core/global/interfaces'
import { ENV } from '@/constants/env'

export class IORedisCacheProvider implements CacheProvider {
  private static redis: IORedis | null = null
  private static connectPromise: Promise<IORedis> | null = null

  private createRedis(): IORedis {
    const options = this.getRedisOptions(ENV.redisUrl)

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

  private getRedisOptions(redisUrl: string): RedisOptions {
    const url = new URL(redisUrl)

    const isRedis = url.protocol === 'redis:'
    const isRedisTls = url.protocol === 'rediss:'

    if (!isRedis && !isRedisTls) {
      throw new Error(`Invalid Redis protocol: ${url.protocol}`)
    }

    const db = Number(url.pathname.replace('/', '') || 0)

    const options: RedisOptions = {
      host: url.hostname,
      port: Number(url.port || (isRedisTls ? 6380 : 6379)),
      username: url.username ? decodeURIComponent(url.username) : undefined,
      password: url.password ? decodeURIComponent(url.password) : undefined,
      db: Number.isFinite(db) ? db : 0,

      // Important for remote Redis
      lazyConnect: true,
      enableReadyCheck: true,

      // Do not queue cache commands forever while Redis is offline
      enableOfflineQueue: false,

      // Fail fast instead of producing long server delays
      maxRetriesPerRequest: 1,
      connectTimeout: 15_000,

      // Helps in some hosting environments that have IPv6/DNS issues
      family: 4,

      retryStrategy(times) {
        if (times > 3) return null
        return Math.min(times * 500, 2_000)
      },
    }

    if (isRedisTls) {
      options.tls = {
        rejectUnauthorized: process.env.REDIS_TLS_REJECT_UNAUTHORIZED !== 'false',
        ...(net.isIP(url.hostname) ? {} : { servername: url.hostname }),
      }
    }

    return options
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
