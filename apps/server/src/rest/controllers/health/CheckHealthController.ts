import net from 'node:net'
import tls from 'node:tls'

import IORedis from 'ioredis'
import type { Controller, Http } from '@stardust/core/global/interfaces'

import { APP_VERSION, ENV } from '@/constants'
import { IORedisCacheProvider } from '@/provision/cache/ioredis/IORedisCacheProvider'

type HealthStatus = 'UP' | 'DOWN'

type HealthServicesStatus = {
  postgres: HealthStatus
  redis: HealthStatus
  inngest: HealthStatus
  supabase: HealthStatus
}

export class CheckHealthController implements Controller {
  static readonly HEALTH_CHECK_TIMEOUT_IN_MS = 1500

  async handle(http: Http) {
    const services = await this.checkServices()
    const status = Object.values(services).every((status) => status === 'UP')
      ? 'UP'
      : 'DOWN'

    return http.send({
      status,
      version: APP_VERSION,
      timestamp: new Date().toISOString(),
      services,
    })
  }

  private async checkServices(): Promise<HealthServicesStatus> {
    const [postgres, redis, inngest, supabase] = await Promise.all([
      this.checkPostgres(),
      this.checkRedis(),
      this.checkInngest(),
      this.checkSupabase(),
    ])

    return {
      postgres,
      redis,
      inngest,
      supabase,
    }
  }

  protected async checkPostgres(): Promise<HealthStatus> {
    const databaseUrl = new URL(ENV.databaseUrl)
    const shouldPreferTls =
      databaseUrl.searchParams.get('sslmode') !== 'disable' &&
      databaseUrl.hostname !== 'localhost' &&
      databaseUrl.hostname !== '127.0.0.1'

    const connectionStrategies = shouldPreferTls ? [true, false] : [false, true]

    for (const shouldUseTls of connectionStrategies) {
      try {
        await this.checkSocketConnection(databaseUrl, shouldUseTls)
        return 'UP'
      } catch {
        continue
      }
    }

    return 'DOWN'
  }

  protected async checkRedis(): Promise<HealthStatus> {
    const redis = new IORedis({
      ...IORedisCacheProvider.buildRedisOptions(ENV.redisUrl),
      connectTimeout: CheckHealthController.HEALTH_CHECK_TIMEOUT_IN_MS,
      maxRetriesPerRequest: 0,
    })

    try {
      await this.withTimeout(redis.connect())
      const response = await this.withTimeout(redis.ping())
      return response === 'PONG' ? 'UP' : 'DOWN'
    } catch {
      return 'DOWN'
    } finally {
      redis.disconnect()
    }
  }

  protected async checkInngest(): Promise<HealthStatus> {
    const url =
      ENV.mode === 'development'
        ? 'http://127.0.0.1:8288/health'
        : 'https://api.inngest.com/health'

    return this.checkHttpEndpoint(url)
  }

  protected async checkSupabase(): Promise<HealthStatus> {
    return this.checkHttpEndpoint(`${ENV.supabaseUrl}/auth/v1/health`, {
      apikey: ENV.supabaseKey,
      Authorization: `Bearer ${ENV.supabaseKey}`,
    })
  }

  protected async checkHttpEndpoint(
    url: string,
    headers?: Record<string, string>,
  ): Promise<HealthStatus> {
    const abortController = new AbortController()
    const timeout = setTimeout(
      () => abortController.abort(),
      CheckHealthController.HEALTH_CHECK_TIMEOUT_IN_MS,
    )

    try {
      const response = await fetch(url, {
        headers,
        signal: abortController.signal,
      })

      return response.ok ? 'UP' : 'DOWN'
    } catch {
      return 'DOWN'
    } finally {
      clearTimeout(timeout)
    }
  }

  protected async checkSocketConnection(
    databaseUrl: URL,
    shouldUseTls: boolean,
  ): Promise<void> {
    await this.withTimeout(
      new Promise<void>((resolve, reject) => {
        const port = Number(databaseUrl.port || 5432)
        const host = databaseUrl.hostname
        const socket = shouldUseTls
          ? tls.connect({ host, port, servername: host })
          : net.connect({ host, port })

        const handleConnection = () => {
          socket.destroy()
          resolve()
        }

        socket.once(shouldUseTls ? 'secureConnect' : 'connect', handleConnection)
        socket.once('error', reject)
      }),
    )
  }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    let timeout: NodeJS.Timeout | undefined

    try {
      return await Promise.race([
        promise,
        new Promise<never>((_, reject) => {
          timeout = setTimeout(
            () => reject(new Error('Health check timeout')),
            CheckHealthController.HEALTH_CHECK_TIMEOUT_IN_MS,
          )
        }),
      ])
    } finally {
      clearTimeout(timeout)
    }
  }
}
