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
  constructor(protected readonly inngest: Inngest) {}

  protected async handleFailure({ error }: OnFailureCtx<Inngest>) {
    if (ENV.mode === 'development') return

    const telemetryProvider = new SentryTelemetryProvider()
    const notificationService = new DiscordNotificationService(
      new AxiosRestClient(ENV.discordWebhookUrl),
    )
    if (error instanceof AppError) {
      await notificationService.sendErrorNotification(
        'server',
        `Erro capturado na fila: título: ${error.title} menssagem de erro: ${error.message}`,
      )
    } else if (error instanceof Error) {
      await notificationService.sendErrorNotification(
        'server',
        `Erro desconhecido capturado na fila: título: ${error.name} menssagem de erro: ${error.message}`,
      )
    }
    telemetryProvider.trackError(error)
  }
}
