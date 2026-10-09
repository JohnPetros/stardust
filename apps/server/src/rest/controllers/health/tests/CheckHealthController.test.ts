import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3'

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
      s3: HealthStatus
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

  protected async checkS3() {
    return this.services.s3
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
  request:
    | {
        headers?: Record<string, string>
        init?: RequestInit
        url: string
      }
    | undefined

  constructor(private readonly status: HealthStatus) {
    super()
  }

  protected override async checkHttpEndpoint(
    url: string,
    headers?: Record<string, string>,
    init?: RequestInit,
  ): Promise<HealthStatus> {
    this.request = { url, headers, init }
    return this.status
  }

  async runCheckInngest() {
    return this.checkInngest()
  }

  async runCheckSupabase() {
    return this.checkSupabase()
  }
}

class CheckS3ControllerStub extends CheckHealthController {
  async runCheckS3() {
    return this.checkS3()
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
      s3: 'UP',
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
        'supabase-auth': 'UP',
        s3: 'UP',
      },
    })
  })

  it('should return DOWN when at least one service is DOWN', async () => {
    const controller = new CheckHealthControllerStub({
      postgres: 'UP',
      redis: 'DOWN',
      inngest: 'UP',
      supabase: 'UP',
      s3: 'UP',
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
        'supabase-auth': 'UP',
        s3: 'UP',
      },
    })
  })

  it('should return DOWN when only S3 is DOWN', async () => {
    const controller = new CheckHealthControllerStub({
      postgres: 'UP',
      redis: 'UP',
      inngest: 'UP',
      supabase: 'UP',
      s3: 'DOWN',
    })

    await controller.handle(http)

    expect(http.send).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'DOWN',
        services: expect.objectContaining({ s3: 'DOWN' }),
      }),
    )
  })

  it.each(['development', 'production'] as const)(
    'should check the S3 bucket in %s mode',
    async (mode) => {
      const previousMode = ENV.mode
      ENV.mode = mode
      const send = jest.spyOn(S3Client.prototype, 'send').mockResolvedValue({} as never)

      try {
        expect(await new CheckS3ControllerStub().runCheckS3()).toBe('UP')
        expect(send).toHaveBeenCalledWith(expect.any(HeadBucketCommand), {
          abortSignal: expect.any(AbortSignal),
        })
        expect(send.mock.calls[0][0].input).toEqual({
          Bucket:
            mode === 'production' ? 'stardust-bucket-prod' : 'stardust-bucket-local',
        })
      } finally {
        ENV.mode = previousMode
        jest.restoreAllMocks()
      }
    },
  )

  it('should return DOWN when the bucket check fails', async () => {
    jest
      .spyOn(S3Client.prototype, 'send')
      .mockImplementation(() => Promise.reject(new Error('Access denied')) as never)

    try {
      expect(await new CheckS3ControllerStub().runCheckS3()).toBe('DOWN')
    } finally {
      jest.restoreAllMocks()
    }
  })

  it('should abort a stalled S3 bucket check', async () => {
    jest.useFakeTimers()
    jest.spyOn(S3Client.prototype, 'send').mockImplementation(
      (_, options: any) =>
        new Promise((_, reject) => {
          options.abortSignal.addEventListener('abort', () =>
            reject(new Error('Aborted')),
          )
        }) as never,
    )

    try {
      const status = new CheckS3ControllerStub().runCheckS3()
      await jest.advanceTimersByTimeAsync(
        CheckHealthController.HEALTH_CHECK_TIMEOUT_IN_MS,
      )
      expect(await status).toBe('DOWN')
    } finally {
      jest.restoreAllMocks()
      jest.useRealTimers()
    }
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

  it('should check local Inngest health endpoint in development mode', async () => {
    const controller = new CheckHttpControllerStub('UP')
    const previousMode = ENV.mode

    ENV.mode = 'development'

    let status: HealthStatus

    try {
      status = await controller.runCheckInngest()
    } finally {
      ENV.mode = previousMode
    }

    expect(status).toBe('UP')
    expect(controller.request).toEqual({
      url: 'http://127.0.0.1:8288/health',
      headers: undefined,
      init: undefined,
    })
  })

  it('should check Inngest event API with event key outside development', async () => {
    const controller = new CheckHttpControllerStub('UP')
    const previousMode = ENV.mode
    const previousInngestEventKey = ENV.inngestEventKey

    ENV.mode = 'production'
    ENV.inngestEventKey = 'event-key'

    let status: HealthStatus

    try {
      status = await controller.runCheckInngest()
    } finally {
      ENV.mode = previousMode
      ENV.inngestEventKey = previousInngestEventKey
    }

    expect(status).toBe('UP')
    expect(controller.request).toEqual({
      url: 'https://inn.gs/e/event-key',
      headers: {
        'Content-Type': 'application/json',
      },
      init: {
        method: 'POST',
        body: JSON.stringify({
          name: 'health.check',
          data: {
            source: 'stardust-healthcheck',
          },
        }),
      },
    })
  })

  it('should return DOWN when inngest event key is missing outside development', async () => {
    const controller = new CheckHttpControllerStub('UP')
    const previousMode = ENV.mode
    const previousInngestEventKey = ENV.inngestEventKey

    ENV.mode = 'production'
    ENV.inngestEventKey = undefined

    let status: HealthStatus

    try {
      status = await controller.runCheckInngest()
    } finally {
      ENV.mode = previousMode
      ENV.inngestEventKey = previousInngestEventKey
    }

    expect(status).toBe('DOWN')
    expect(controller.request).toBeUndefined()
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
      init: undefined,
    })
  })
})
