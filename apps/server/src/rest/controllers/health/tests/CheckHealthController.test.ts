import { type Mock, mock } from 'ts-jest-mocker'

import { ENV } from '@/constants'
import { RestResponse } from '@stardust/core/global/responses'
import type { Http } from '@stardust/core/global/interfaces'

import { APP_VERSION } from '@/constants'
import { CheckHealthController } from '../CheckHealthController'

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

describe('Check Health Controller', () => {
  let http: Mock<Http>

  beforeEach(() => {
    http = mock()
    http.send.mockReturnValue(new RestResponse())
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
    ENV.databaseUrl = 'postgresql://postgres:postgres@aws-0-sa-east-1.pooler.supabase.com:6543/postgres'

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
})
