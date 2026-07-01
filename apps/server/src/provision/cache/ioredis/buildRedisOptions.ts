import net from 'node:net'

import type { RedisOptions } from 'ioredis'

export function buildRedisOptions(redisUrl: string): RedisOptions {
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
    lazyConnect: true,
    enableReadyCheck: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
    connectTimeout: 15_000,
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
