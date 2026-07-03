import type { Inngest } from 'inngest'
import { AppError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import { DiscordNotificationService } from '@/rest/services'
import { SentryTelemetryProvider } from '@/provision/telemetry'

export function eventType(name: string, _options?: unknown) {
  return name
}

export class InngestFunctions {
  private telemetryProvider?: SentryTelemetryProvider
  private readonly notificationService: DiscordNotificationService

  constructor(protected readonly inngest: Inngest) {
    this.notificationService = new DiscordNotificationService(
      new AxiosRestClient(ENV.discordWebhookUrl),
    )
  }

  protected createFunction(
    options: {
      triggers: unknown
      onFailure?: (context: any) => Promise<void>
      [key: string]: unknown
    },
    handler: (context: any) => Promise<unknown>,
  ) {
    const { triggers, ...functionOptions } = options

    return this.inngest.createFunction(
      functionOptions as never,
      triggers as never,
      handler,
    )
  }

  private getTelemetryProvider(): SentryTelemetryProvider {
    if (!this.telemetryProvider) {
      this.telemetryProvider = new SentryTelemetryProvider()
    }
    return this.telemetryProvider
  }

  protected async handleFailure({ error }: { error: unknown }, jobName: string) {
    if (ENV.mode === 'production') return

    const telemetryProvider = this.getTelemetryProvider()

    if (error instanceof AppError) {
      await this.notificationService.sendErrorNotification(
        'server',
        `Erro capturado na fila.Job: ${jobName}.\nTítulo: ${error.title}.\nMensagem de erro: ${error.message}`,
      )
    } else if (error instanceof Error) {
      await this.notificationService.sendErrorNotification(
        'server',
        `Erro desconhecido capturado na fila.\nJob: ${jobName}.\nTítulo: ${error.name}.\nMensagem de erro: ${error.message}`,
      )
    }

    const normalizedError = error instanceof Error ? error : new Error(String(error))
    telemetryProvider.trackError(normalizedError)
  }
}
