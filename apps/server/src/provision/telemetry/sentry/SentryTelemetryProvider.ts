import * as Sentry from '@sentry/node'

import type { TelemetryProvider } from '@stardust/core/global/interfaces'
import { AppError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'

function initializeSentryClient(): Sentry.NodeClient | undefined {
  if (ENV.mode !== 'production') return

  const sentry = Sentry.init({ dsn: ENV.sentryDsn })
  if (!sentry) throw new AppError('Falha ao inicializar o Sentry')

  return sentry
}

export class SentryTelemetryProvider implements TelemetryProvider {
  private readonly sentry?: Sentry.NodeClient

  constructor() {
    this.sentry = initializeSentryClient()
  }

  trackError(error: Error): void {
    if (this.sentry) {
      this.sentry.captureException(error)
      return
    }

    console.error(error)
  }
}
