import IORedis, { type RedisOptions } from 'ioredis'

import type {
  RateLimitDecision,
  RateLimitInput,
  RateLimiterProvider,
} from '@stardust/core/global/interfaces'
import { AppError } from '@stardust/core/global/errors'

import { ENV } from '@/constants/env'

const RATE_LIMIT_SCRIPT = `
local count = redis.call('INCR', KEYS[1])
if count == 1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[2])
end
local ttl = redis.call('PTTL', KEYS[1])
return { count, ttl }
`

const PROVIDER_ERROR = 'Falha ao consultar o rate limiter'

export class IORedisRateLimiterProvider implements RateLimiterProvider {
  private readonly redis: IORedis
  private connectPromise: Promise<void> | null = null

  constructor(redisUrl = ENV.redisUrl) {
    const options: RedisOptions = {
      lazyConnect: true,
      enableOfflineQueue: false,
      maxRetriesPerRequest: 0,
      connectTimeout: 250,
      commandTimeout: 250,
    }

    this.redis = new IORedis(redisUrl, options)
  }

  async consume(input: RateLimitInput): Promise<RateLimitDecision> {
    this.validateInput(input)

    try {
      await this.ensureConnected()
      const result = await this.redis.eval(
        RATE_LIMIT_SCRIPT,
        1,
        input.key,
        input.limit,
        input.windowInSeconds * 1000,
      )

      if (!Array.isArray(result) || result.length !== 2) {
        throw new Error('Invalid Redis response')
      }

      const count = this.parseInteger(result[0])
      const ttl = this.parseInteger(result[1])

      if (count === null || ttl === null || count < 1 || ttl < 0) {
        throw new AppError(PROVIDER_ERROR, PROVIDER_ERROR)
      }

      return {
        isAllowed: count <= input.limit,
        retryAfterInSeconds: Math.max(1, Math.ceil(ttl / 1000)),
      }
    } catch (error) {
      if (error instanceof AppError) throw error
      throw new AppError(PROVIDER_ERROR, PROVIDER_ERROR)
    }
  }

  async shutdown(): Promise<void> {
    if (this.redis.status === 'wait' || this.redis.status === 'connecting') {
      this.redis.disconnect()
    } else if (this.redis.status !== 'end') {
      await this.redis.quit()
    }
  }

  private async ensureConnected(): Promise<void> {
    if (this.redis.status === 'ready') return

    if (this.redis.status === 'wait') {
      this.connectPromise ??= this.redis.connect().finally(() => {
        this.connectPromise = null
      })
      await this.connectPromise
      return
    }

    if (this.redis.status === 'connecting') {
      await new Promise<void>((resolve, reject) => {
        const onReady = () => {
          cleanup()
          resolve()
        }
        const onError = (error: Error) => {
          cleanup()
          reject(error)
        }
        const cleanup = () => {
          this.redis.off('ready', onReady)
          this.redis.off('error', onError)
        }
        this.redis.once('ready', onReady)
        this.redis.once('error', onError)
      })
    }
  }

  private parseInteger(value: unknown): number | null {
    if (typeof value === 'number') return Number.isInteger(value) ? value : null
    if (typeof value !== 'string' || !/^-?\d+$/.test(value)) return null
    const parsed = Number(value)
    return Number.isSafeInteger(parsed) ? parsed : null
  }

  private validateInput(input: RateLimitInput): void {
    if (
      !input ||
      typeof input.key !== 'string' ||
      input.key.length === 0 ||
      !Number.isInteger(input.limit) ||
      input.limit < 1 ||
      !Number.isInteger(input.windowInSeconds) ||
      input.windowInSeconds < 1
    ) {
      throw new AppError(PROVIDER_ERROR, PROVIDER_ERROR)
    }
  }
}
