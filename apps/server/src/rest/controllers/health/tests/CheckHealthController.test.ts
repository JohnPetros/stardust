import { type Mock, mock } from 'ts-jest-mocker'

import { ENV } from '@/constants'
import { RestResponse } from '@stardust/core/global/responses'
import type { Http } from '@stardust/core/global/interfaces'

import { APP_VERSION } from '@/constants'
import { CheckHealthController } from '../CheckHealthController'

const mockRedisConnect = jest.fn()
const mockRedisPing = jest.fn()
const mockRedisDisconnect = jest.fn()

jest.mock('ioredis', () =>
  jest.fn().mockImplementation(() => ({
    connect: mockRedisConnect,
    ping: mockRedisPing,
    disconnect: mockRedisDisconnect,
  })),
)

type HealthStatus = 'UP' | 'DOWN'

class CheckHealthControllerStub extends CheckHealthController {
  constructor(
    private readonly services: {
      postgres: HealthStatus
      redis: HealthStatus
      inngest: HealthStatus
      supabase: HealthStatus
    },
  ) {
    super()
  }

  protected async checkPostgres() {
    return this.services.postgres
  }

  protected async checkRedis() {
    return this.services.redis
  }

  protected async checkInngest() {
    return this.services.inngest
  }

  protected async checkSupabase() {
    return this.services.supabase
  }
}

class CheckPostgresControllerStub extends CheckHealthController {
  constructor(
    private readonly responses: Map<boolean, HealthStatus>,
    private readonly calls: boolean[] = [],
  ) {
    super()
  }

  get connectionCalls() {
    return this.calls
  }

  async runCheckPostgres() {
    return this.checkPostgres()
  }

  protected override async checkSocketConnection(
    _: URL,
    shouldUseTls: boolean,
  ): Promise<void> {
    this.calls.push(shouldUseTls)

    if (this.responses.get(shouldUseTls) === 'UP') return

    throw new Error('Connection failed')
  }
}

class CheckHttpControllerStub extends CheckHealthController {
  request: { headers?: Record<string, string>; url: string } | undefined

  constructor(private readonly status: HealthStatus) {
    super()
  }

  protected override async checkHttpEndpoint(
    url: string,
    headers?: Record<string, string>,
  ): Promise<HealthStatus> {
    this.request = { url, headers }
    return this.status
  }

  async runCheckInngest() {
    return this.checkInngest()
  }

  async runCheckSupabase() {
    return this.checkSupabase()
  }
}

class CheckHttpEndpointControllerStub extends CheckHealthController {
  async runCheckHttpEndpoint(url: string, headers?: Record<string, string>) {
    return this.checkHttpEndpoint(url, headers)
  }
}

class CheckRedisControllerStub extends CheckHealthController {
  async runCheckRedis() {
    return this.checkRedis()
  }
}

describe('Check Health Controller', () => {
  let http: Mock<Http>
  let fetchMock: jest.SpiedFunction<typeof fetch>

  beforeEach(() => {
    mockRedisConnect.mockReset()
    mockRedisPing.mockReset()
    mockRedisDisconnect.mockReset()
    http = mock()
    http.send.mockReturnValue(new RestResponse())
    fetchMock = jest.spyOn(global, 'fetch')
  })

  afterEach(() => {
    fetchMock.mockRestore()
  })

  it('should return UP when all services are UP', async () => {
    const controller = new CheckHealthControllerStub({
      postgres: 'UP',
      redis: 'UP',
      inngest: 'UP',
      supabase: 'UP',
    })

    await controller.handle(http)

    expect(http.send).toHaveBeenCalledWith({
      status: 'UP',
      version: APP_VERSION,
      timestamp: expect.any(String),
      services: {
        postgres: 'UP',
        redis: 'UP',
        inngest: 'UP',
        supabase: 'UP',
      },
    })
  })

  it('should return DOWN when at least one service is DOWN', async () => {
    const controller = new CheckHealthControllerStub({
      postgres: 'UP',
      redis: 'DOWN',
      inngest: 'UP',
      supabase: 'UP',
    })

    await controller.handle(http)

    expect(http.send).toHaveBeenCalledWith({
      status: 'DOWN',
      version: APP_VERSION,
      timestamp: expect.any(String),
      services: {
        postgres: 'UP',
        redis: 'DOWN',
        inngest: 'UP',
        supabase: 'UP',
      },
    })
  })

  it('should fallback to plain TCP when TLS check fails for postgres', async () => {
    const controller = new CheckPostgresControllerStub(
      new Map([
        [true, 'DOWN'],
        [false, 'UP'],
      ]),
    )

    const previousDatabaseUrl = ENV.databaseUrl
    ENV.databaseUrl =
      'postgresql://postgres:postgres@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'

    let status: HealthStatus

    try {
      status = await controller.runCheckPostgres()
    } finally {
      ENV.databaseUrl = previousDatabaseUrl
    }

    expect(status).toBe('UP')
    expect(controller.connectionCalls).toEqual([true, false])
  })

  it('should check Inngest health endpoint', async () => {
    const controller = new CheckHttpControllerStub('UP')

    const status = await controller.runCheckInngest()

    expect(status).toBe('UP')
    expect(controller.request).toEqual({
      url:
        ENV.mode === 'development'
          ? 'http://127.0.0.1:8288/health'
          : 'https://api.inngest.com/health',
      headers: undefined,
    })
  })

  it('should check Supabase auth health endpoint with auth headers', async () => {
    const controller = new CheckHttpControllerStub('UP')

    const status = await controller.runCheckSupabase()

    expect(status).toBe('UP')
    expect(controller.request).toEqual({
      url: `${ENV.supabaseUrl}/auth/v1/health`,
      headers: {
        apikey: ENV.supabaseKey,
        Authorization: `Bearer ${ENV.supabaseKey}`,
      },
    })
  })

  it('should return UP when the HTTP health endpoint responds successfully', async () => {
    const controller = new CheckHttpEndpointControllerStub()
    fetchMock.mockResolvedValue({ ok: true } as Response)

    const status = await controller.runCheckHttpEndpoint('https://example.com/health', {
      Authorization: 'Bearer token',
    })

    expect(status).toBe('UP')
    expect(fetchMock).toHaveBeenCalledWith('https://example.com/health', {
      headers: { Authorization: 'Bearer token' },
      signal: expect.any(AbortSignal),
    })
  })

  it('should return DOWN when the HTTP health endpoint responds with an error status', async () => {
    const controller = new CheckHttpEndpointControllerStub()
    fetchMock.mockResolvedValue({ ok: false } as Response)

    const status = await controller.runCheckHttpEndpoint('https://example.com/health')

    expect(status).toBe('DOWN')
  })

  it('should return DOWN when the HTTP health endpoint request fails', async () => {
    const controller = new CheckHttpEndpointControllerStub()
    fetchMock.mockRejectedValue(new Error('Network error'))

    const status = await controller.runCheckHttpEndpoint('https://example.com/health')

    expect(status).toBe('DOWN')
  })

  it('should return UP when Redis responds to ping', async () => {
    const controller = new CheckRedisControllerStub()
    mockRedisConnect.mockResolvedValue(undefined)
    mockRedisPing.mockResolvedValue('PONG')

    const status = await controller.runCheckRedis()

    expect(status).toBe('UP')
    expect(mockRedisConnect).toHaveBeenCalledTimes(1)
    expect(mockRedisPing).toHaveBeenCalledTimes(1)
    expect(mockRedisDisconnect).toHaveBeenCalledTimes(1)
  })

  it('should return DOWN when Redis ping returns an unexpected response', async () => {
    const controller = new CheckRedisControllerStub()
    mockRedisConnect.mockResolvedValue(undefined)
    mockRedisPing.mockResolvedValue('NOPE')

    const status = await controller.runCheckRedis()

    expect(status).toBe('DOWN')
    expect(mockRedisDisconnect).toHaveBeenCalledTimes(1)
  })

  it('should return DOWN when Redis connection fails', async () => {
    const controller = new CheckRedisControllerStub()
    mockRedisConnect.mockRejectedValue(new Error('Connection failed'))

    const status = await controller.runCheckRedis()

    expect(status).toBe('DOWN')
    expect(mockRedisPing).not.toHaveBeenCalled()
    expect(mockRedisDisconnect).toHaveBeenCalledTimes(1)
  })
})
