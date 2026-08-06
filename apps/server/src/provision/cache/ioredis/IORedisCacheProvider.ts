import net from 'node:net'

import IORedis, { type RedisOptions } from 'ioredis'

import type { CacheOptions, CacheProvider } from '@stardust/core/global/interfaces'
import { ENV } from '@/constants/env'

export class IORedisCacheProvider implements CacheProvider {
  private static redis: IORedis | null = null
  private static connectPromise: Promise<IORedis> | null = null

  private static readonly connectionTimeoutMs = 15_000

  private createRedis(): IORedis {
    const redis = new IORedis(IORedisCacheProvider.buildRedisOptions(ENV.redisUrl))

    redis.on('connect', () => {
      console.info('[Redis] Connected')
    })

    redis.on('ready', () => {
      console.info('[Redis] Ready')
    })

    redis.on('reconnecting', (delay: number) => {
      console.warn(`[Redis] Reconnecting in ${delay}ms`)
    })

    redis.on('error', (error: Error) => {
      console.error('[Redis] Error:', error.message)
    })

    redis.on('close', () => {
      console.warn('[Redis] Connection closed')
    })

    redis.on('end', () => {
      console.warn('[Redis] Connection ended')

      if (IORedisCacheProvider.redis === redis) {
        IORedisCacheProvider.redis = null
        IORedisCacheProvider.connectPromise = null
      }
    })

    return redis
  }

  private async getRedis(): Promise<IORedis> {
    let redis = IORedisCacheProvider.redis

    if (!redis || redis.status === 'end') {
      redis = this.createRedis()
      IORedisCacheProvider.redis = redis
      IORedisCacheProvider.connectPromise = null
    }

    if (redis.status === 'ready') {
      return redis
    }

    if (IORedisCacheProvider.connectPromise) {
      return IORedisCacheProvider.connectPromise
    }

    const connectPromise = this.connectRedis(redis)

    IORedisCacheProvider.connectPromise = connectPromise

    try {
      return await connectPromise
    } catch (error) {
      redis.disconnect()

      if (IORedisCacheProvider.redis === redis) {
        IORedisCacheProvider.redis = null
      }

      throw error
    } finally {
      if (IORedisCacheProvider.connectPromise === connectPromise) {
        IORedisCacheProvider.connectPromise = null
      }
    }
  }

  private async connectRedis(redis: IORedis): Promise<IORedis> {
    if (redis.status === 'ready') {
      return redis
    }

    /*
     * With lazyConnect enabled, a newly created client starts with the
     * "wait" status and must be connected explicitly.
     */
    if (redis.status === 'wait') {
      await redis.connect()
      return redis
    }

    /*
     * During an automatic reconnection, calling connect() again can throw
     * "Redis is already connecting/connected". Wait for the existing
     * connection attempt instead.
     */
    await IORedisCacheProvider.waitUntilReady(redis)

    return redis
  }

  private static waitUntilReady(redis: IORedis): Promise<void> {
    if (redis.status === 'ready') {
      return Promise.resolve()
    }

    if (redis.status === 'end') {
      return Promise.reject(new Error('Redis connection has ended'))
    }

    return new Promise<void>((resolve, reject) => {
      const cleanup = (): void => {
        clearTimeout(timeout)
        redis.off('ready', handleReady)
        redis.off('end', handleEnd)
      }

      const handleReady = (): void => {
        cleanup()
        resolve()
      }

      const handleEnd = (): void => {
        cleanup()
        reject(new Error('Redis connection ended before becoming ready'))
      }

      const timeout = setTimeout(() => {
        cleanup()

        reject(
          new Error(
            `Redis did not become ready within ${
              IORedisCacheProvider.connectionTimeoutMs
            }ms`,
          ),
        )
      }, IORedisCacheProvider.connectionTimeoutMs)

      redis.once('ready', handleReady)
      redis.once('end', handleEnd)

      /*
       * Avoid keeping the Node.js process alive only because of this timer.
       */
      timeout.unref()
    })
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

  /**
   * Gracefully closes the shared Redis connection.
   *
   * Call this during application shutdown when appropriate.
   */
  static async shutdown(): Promise<void> {
    const redis = IORedisCacheProvider.redis

    IORedisCacheProvider.redis = null
    IORedisCacheProvider.connectPromise = null

    if (!redis || redis.status === 'end') {
      return
    }

    try {
      if (redis.status === 'ready') {
        await redis.quit()
      } else {
        redis.disconnect()
      }
    } catch (error) {
      redis.disconnect()

      const message = error instanceof Error ? error.message : String(error)

      console.error('[Redis] Shutdown failed:', message)
    }
  }

  static buildRedisOptions(redisUrl: string): RedisOptions {
    const url = new URL(redisUrl)

    const isRedis = url.protocol === 'redis:'
    const isRedisTls = url.protocol === 'rediss:'

    if (!isRedis && !isRedisTls) {
      throw new Error(`Invalid Redis protocol: ${url.protocol}`)
    }

    const hostname = url.hostname.replace(/^\[(.*)]$/, '$1')
    const port = url.port ? Number(url.port) : 6379
    const databasePath = url.pathname.slice(1)
    const db = databasePath === '' ? 0 : Number(databasePath)

    if (!hostname) {
      throw new Error('Redis hostname is required')
    }

    if (!Number.isInteger(port) || port < 1 || port > 65_535) {
      throw new Error(`Invalid Redis port: ${url.port}`)
    }

    if (!Number.isInteger(db) || db < 0) {
      throw new Error(`Invalid Redis database: ${url.pathname}`)
    }

    const options: RedisOptions = {
      host: hostname,
      port,
      db,

      username: url.username ? decodeURIComponent(url.username) : undefined,

      password: url.password ? decodeURIComponent(url.password) : undefined,

      lazyConnect: true,
      enableReadyCheck: true,

      enableOfflineQueue: false,

      maxRetriesPerRequest: 1,

      connectTimeout: IORedisCacheProvider.connectionTimeoutMs,

      retryStrategy(attempt: number): number {
        return Math.min(attempt * 500, 5_000)
      },
    }

    if (isRedisTls) {
      options.tls = {
        rejectUnauthorized: process.env.REDIS_TLS_REJECT_UNAUTHORIZED !== 'false',

        ...(net.isIP(hostname) === 0 ? { servername: hostname } : {}),
      }
    }

    return options
  }
}
