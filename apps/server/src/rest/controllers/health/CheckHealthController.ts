import net from 'node:net'
import tls from 'node:tls'

import IORedis from 'ioredis'
import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3'
import type { Controller, Http } from '@stardust/core/global/interfaces'

import { APP_VERSION, ENV } from '@/constants'
import { IORedisCacheProvider } from '@/provision/cache/ioredis/IORedisCacheProvider'

type HealthStatus = 'UP' | 'DOWN'

type HealthServicesStatus = {
  postgres: HealthStatus
  redis: HealthStatus
  inngest: HealthStatus
  'supabase-auth': HealthStatus
  s3: HealthStatus
}

const LOCAL_S3_CLIENT_OPTIONS = {
  region: 'auto',
  endpoint: ENV.s3Endpoint,
  forcePathStyle: true,
  credentials: {
    accessKeyId: ENV.s3AccessKeyId,
    secretAccessKey: ENV.s3SecretAccessKey,
  },
  maxAttempts: 1,
}

const S3_CLIENT_OPTIONS_BY_MODE = {
  development: LOCAL_S3_CLIENT_OPTIONS,
  test: LOCAL_S3_CLIENT_OPTIONS,
  production: {
    ...LOCAL_S3_CLIENT_OPTIONS,
    endpoint: `https://${ENV.s3AccountId}.r2.cloudflarestorage.com`,
    forcePathStyle: false,
  },
}

const S3_BUCKET_BY_MODE = {
  development: 'stardust-bucket-local',
  test: 'stardust-bucket-local',
  production: 'stardust-bucket-prod',
}

const S3_HEAD_BUCKET_COMMAND_BY_MODE = {
  development: new HeadBucketCommand({ Bucket: S3_BUCKET_BY_MODE.development }),
  test: new HeadBucketCommand({ Bucket: S3_BUCKET_BY_MODE.test }),
  production: new HeadBucketCommand({ Bucket: S3_BUCKET_BY_MODE.production }),
}

export class CheckHealthController implements Controller {
  static readonly HEALTH_CHECK_TIMEOUT_IN_MS = 1500
  private readonly s3Client = new S3Client(S3_CLIENT_OPTIONS_BY_MODE[ENV.mode])

  async handle(http: Http) {
    const services = await this.checkServices()
    return http.send(this.healthResponse(services))
  }

  private healthResponse(services: HealthServicesStatus) {
    return {
      status: this.overallStatus(services),
      version: APP_VERSION,
      timestamp: new Date().toISOString(),
      services,
    }
  }

  private overallStatus(services: HealthServicesStatus): HealthStatus {
    return Object.values(services).every((status) => status === 'UP') ? 'UP' : 'DOWN'
  }

  private async checkServices(): Promise<HealthServicesStatus> {
    return this.buildHealthServicesStatus(await this.checkServiceStatuses())
  }

  private checkServiceStatuses(): Promise<HealthStatus[]> {
    return Promise.all([
      this.checkPostgres(),
      this.checkRedis(),
      this.checkInngest(),
      this.checkSupabase(),
      this.checkS3(),
    ])
  }

  private buildHealthServicesStatus([
    postgres,
    redis,
    inngest,
    supabaseAuth,
    s3,
  ]: HealthStatus[]): HealthServicesStatus {
    return {
      postgres,
      redis,
      inngest,
      'supabase-auth': supabaseAuth,
      s3,
    }
  }

  protected async checkPostgres(): Promise<HealthStatus> {
    const databaseUrl = new URL(ENV.databaseUrl)
    return this.checkPostgresStrategies(databaseUrl)
  }

  private async checkPostgresStrategies(databaseUrl: URL): Promise<HealthStatus> {
    for (const shouldUseTls of this.connectionStrategies(databaseUrl)) {
      if (await this.isSocketAvailable(databaseUrl, shouldUseTls)) return 'UP'
    }

    return 'DOWN'
  }

  private async isSocketAvailable(url: URL, shouldUseTls: boolean) {
    try {
      await this.checkSocketConnection(url, shouldUseTls)
      return true
    } catch {
      return false
    }
  }

  private connectionStrategies(url: URL) {
    const isLocal = ['localhost', '127.0.0.1'].includes(url.hostname)
    const preferTls = url.searchParams.get('sslmode') !== 'disable' && !isLocal
    return preferTls ? [true, false] : [false, true]
  }

  protected async checkRedis(): Promise<HealthStatus> {
    const redis = this.createRedisClient()

    try {
      return await this.readRedisStatusSafely(redis)
    } finally {
      redis.disconnect()
    }
  }

  private async readRedisStatusSafely(redis: IORedis): Promise<HealthStatus> {
    try {
      return await this.readRedisStatus(redis)
    } catch {
      return 'DOWN'
    }
  }

  private async readRedisStatus(redis: IORedis): Promise<HealthStatus> {
    await this.withTimeout(redis.connect())
    const response = await this.withTimeout(redis.ping())
    return response === 'PONG' ? 'UP' : 'DOWN'
  }

  private createRedisClient() {
    return new IORedis({
      ...IORedisCacheProvider.buildRedisOptions(ENV.redisUrl),
      connectTimeout: CheckHealthController.HEALTH_CHECK_TIMEOUT_IN_MS,
      maxRetriesPerRequest: 0,
    })
  }

  protected async checkInngest(): Promise<HealthStatus> {
    if (ENV.mode === 'development') {
      return this.checkHttpEndpoint('http://127.0.0.1:8288/health')
    }

    return this.checkConfiguredInngest()
  }

  private checkConfiguredInngest(): Promise<HealthStatus> | HealthStatus {
    return ENV.inngestEventKey ? this.checkProductionInngest() : 'DOWN'
  }

  private checkProductionInngest() {
    return this.checkHttpEndpoint(
      `https://inn.gs/e/${ENV.inngestEventKey}`,
      { 'Content-Type': 'application/json' },
      this.inngestRequest(),
    )
  }

  private inngestRequest(): RequestInit {
    return {
      method: 'POST',
      body: JSON.stringify({
        name: 'health.check',
        data: { source: 'stardust-healthcheck' },
      }),
    }
  }

  protected async checkSupabase(): Promise<HealthStatus> {
    return this.checkHttpEndpoint(`${ENV.supabaseUrl}/auth/v1/health`, {
      apikey: ENV.supabaseKey,
      Authorization: `Bearer ${ENV.supabaseKey}`,
    })
  }

  protected checkS3(): Promise<HealthStatus> {
    return this.checkS3Bucket()
  }

  private checkS3Bucket(): Promise<HealthStatus> {
    return this.s3Client
      .send(S3_HEAD_BUCKET_COMMAND_BY_MODE[ENV.mode], this.s3RequestOptions())
      .then(
        () => 'UP' as const,
        () => 'DOWN' as const,
      )
      .finally(() => this.s3Client.destroy())
  }

  private s3RequestOptions() {
    return { abortSignal: this.createS3TimeoutSignal() }
  }

  private createS3TimeoutSignal(): AbortSignal {
    return AbortSignal.timeout(CheckHealthController.HEALTH_CHECK_TIMEOUT_IN_MS)
  }

  protected async checkHttpEndpoint(
    url: string,
    headers?: Record<string, string>,
    init?: RequestInit,
  ): Promise<HealthStatus> {
    const { signal, cancel } = this.httpTimeout()

    try {
      return await this.fetchStatusSafely(url, { ...init, headers, signal })
    } finally {
      cancel()
    }
  }

  private async fetchStatusSafely(url: string, init: RequestInit): Promise<HealthStatus> {
    try {
      return await this.fetchStatus(url, init)
    } catch {
      return 'DOWN'
    }
  }

  private async fetchStatus(url: string, init: RequestInit): Promise<HealthStatus> {
    const response = await fetch(url, init)
    return response.ok ? 'UP' : 'DOWN'
  }

  private httpTimeout() {
    const controller = new AbortController()
    const timeout = setTimeout(
      () => controller.abort(),
      CheckHealthController.HEALTH_CHECK_TIMEOUT_IN_MS,
    )
    return { signal: controller.signal, cancel: () => clearTimeout(timeout) }
  }

  protected async checkSocketConnection(
    databaseUrl: URL,
    shouldUseTls: boolean,
  ): Promise<void> {
    await this.withTimeout(this.connectSocket(databaseUrl, shouldUseTls))
  }

  private connectSocket(databaseUrl: URL, shouldUseTls: boolean) {
    const socket = this.createSocket(databaseUrl, shouldUseTls)
    return new Promise<void>((resolve, reject) => {
      socket.once(shouldUseTls ? 'secureConnect' : 'connect', () => {
        socket.destroy()
        resolve()
      })
      socket.once('error', reject)
    })
  }

  private createSocket(databaseUrl: URL, shouldUseTls: boolean) {
    const port = Number(databaseUrl.port || 5432)
    const host = databaseUrl.hostname
    return shouldUseTls
      ? tls.connect({ host, port, servername: host })
      : net.connect({ host, port })
  }

  private async withTimeout<T>(promise: Promise<T>): Promise<T> {
    const timeout = this.rejectionTimeout()
    try {
      return await Promise.race([promise, timeout.promise])
    } finally {
      timeout.cancel()
    }
  }

  private rejectionTimeout() {
    let timer: NodeJS.Timeout | undefined
    const promise = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error('Health check timeout')),
        CheckHealthController.HEALTH_CHECK_TIMEOUT_IN_MS,
      )
    })
    return { promise, cancel: () => clearTimeout(timer) }
  }
}
