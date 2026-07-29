import { AppError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'
import { DiscordNotificationService } from '@/rest/services'
import { SentryTelemetryProvider } from '@/provision/telemetry'

import { InngestFunctions } from '../InngestFunctions'

jest.mock('@/rest/services', () => ({
  DiscordNotificationService: jest.fn().mockImplementation(() => ({
    sendErrorNotification: jest.fn(),
  })),
}))

jest.mock('@/provision/telemetry', () => ({
  SentryTelemetryProvider: jest.fn().mockImplementation(() => ({
    trackError: jest.fn(),
  })),
}))

class TestInngestFunctions extends InngestFunctions {
  createFunctionPublic(
    options: Parameters<InngestFunctions['createFunction']>[0],
    handler: Parameters<InngestFunctions['createFunction']>[1],
  ) {
    return this.createFunction(options, handler)
  }

  async handleFailurePublic(context: { error: unknown }, jobName: string) {
    return await this.handleFailure(context, jobName)
  }
}

describe('InngestFunctions', () => {
  const originalMode = ENV.mode

  beforeEach(() => {
    jest.clearAllMocks()
    ENV.mode = 'development'
  })

  afterAll(() => {
    ENV.mode = originalMode
  })

  it('should delegate createFunction to inngest', async () => {
    const createFunction = jest.fn().mockReturnValue('created-function')
    const functions = new TestInngestFunctions({ createFunction } as never)
    const handler = jest.fn()

    const created = functions.createFunctionPublic(
      {
        id: 'job-id',
        triggers: { event: 'event.name' },
      },
      handler,
    )

    expect(createFunction).toHaveBeenCalledWith(
      { id: 'job-id' },
      { event: 'event.name' },
      handler,
    )
    expect(created).toBe('created-function')
  })

  it('should notify and track app errors', async () => {
    ENV.mode = 'test'
    const functions = new TestInngestFunctions({ createFunction: jest.fn() } as never)
    const error = new AppError('Failure message')

    await functions.handleFailurePublic({ error }, 'StorageJob')

    const notificationService = (DiscordNotificationService as jest.Mock).mock.results[0]
      ?.value
    const telemetryProvider = (SentryTelemetryProvider as jest.Mock).mock.results[0]
      ?.value

    expect(notificationService.sendErrorNotification).toHaveBeenCalledWith(
      'server',
      expect.stringContaining('StorageJob'),
    )
    expect(telemetryProvider.trackError).toHaveBeenCalledWith(error)
  })

  it('should notify and track generic errors', async () => {
    ENV.mode = 'test'
    const functions = new TestInngestFunctions({ createFunction: jest.fn() } as never)
    const error = new Error('Unknown failure')

    await functions.handleFailurePublic({ error }, 'StorageJob')

    const notificationService = (DiscordNotificationService as jest.Mock).mock.results[0]
      ?.value
    const telemetryProvider = (SentryTelemetryProvider as jest.Mock).mock.results[0]
      ?.value

    expect(notificationService.sendErrorNotification).toHaveBeenCalledWith(
      'server',
      expect.stringContaining('Unknown failure'),
    )
    expect(telemetryProvider.trackError).toHaveBeenCalledWith(error)
  })

  it('should track app errors without notifying Discord in development', async () => {
    const functions = new TestInngestFunctions({ createFunction: jest.fn() } as never)
    const error = new Error('development failure')

    await functions.handleFailurePublic({ error }, 'StorageJob')

    const notificationService = (DiscordNotificationService as jest.Mock).mock.results[0]
      ?.value
    const telemetryProvider = (SentryTelemetryProvider as jest.Mock).mock.results[0]
      ?.value

    expect(notificationService.sendErrorNotification).not.toHaveBeenCalled()
    expect(telemetryProvider.trackError).toHaveBeenCalledWith(error)
  })

  it('should skip notifications in production', async () => {
    ENV.mode = 'production'
    const functions = new TestInngestFunctions({ createFunction: jest.fn() } as never)

    await functions.handleFailurePublic({ error: new Error('skip') }, 'StorageJob')

    expect(SentryTelemetryProvider).not.toHaveBeenCalled()
    expect(DiscordNotificationService).toHaveBeenCalledTimes(1)
    const notificationService = (DiscordNotificationService as jest.Mock).mock.results[0]
      ?.value
    expect(notificationService.sendErrorNotification).not.toHaveBeenCalled()
  })
})
