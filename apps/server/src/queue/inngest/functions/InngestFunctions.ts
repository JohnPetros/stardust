import type { GetFunctionInput, FailureEventArgs, Inngest } from 'inngest'
import { AppError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import { DiscordNotificationService } from '@/rest/services'
import { SentryTelemetryProvider } from '@/provision/telemetry'

type OnFailureCtx<TClient extends Inngest.Any> = Omit<
  GetFunctionInput<TClient, 'inngest/function.failed'>,
  'event'
> &
  FailureEventArgs

export class InngestFunctions {
  private telemetryProvider?: SentryTelemetryProvider
  private readonly notificationService: DiscordNotificationService

  constructor(protected readonly inngest: Inngest) {
    this.notificationService = new DiscordNotificationService(
      new AxiosRestClient(ENV.discordWebhookUrl),
    )
  }

  private getTelemetryProvider(): SentryTelemetryProvider {
    if (!this.telemetryProvider) {
      this.telemetryProvider = new SentryTelemetryProvider()
    }
    return this.telemetryProvider
  }

  protected async handleFailure({ error }: OnFailureCtx<Inngest>) {
    if (ENV.mode === 'development') return

    const telemetryProvider = this.getTelemetryProvider()

    if (error instanceof AppError) {
      await this.notificationService.sendErrorNotification(
        'server',
        `Erro capturado na fila: título: ${error.title} mensagem de erro: ${error.message}`,
      )
    } else if (error instanceof Error) {
      await this.notificationService.sendErrorNotification(
        'server',
        `Erro desconhecido capturado na fila: título: ${error.name} mensagem de erro: ${error.message}`,
      )
    }

    const normalizedError = error instanceof Error ? error : new Error(String(error))
    telemetryProvider.trackError(normalizedError)
  }
}
