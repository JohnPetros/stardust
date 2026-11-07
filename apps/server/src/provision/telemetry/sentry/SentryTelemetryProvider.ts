import * as Sentry from '@sentry/node'

import type { TelemetryProvider } from '@stardust/core/global/interfaces'
import { AppError } from '@stardust/core/global/errors'

import { ENV } from '@/constants'

function isSentryConfigured(): boolean {
  if (ENV.mode !== 'production') return false
  if (ENV.sentryDsn) return true

  console.warn('SENTRY_DSN is not set; errors will only be logged to the console')
  return false
}

function initializeSentryClient(): Sentry.NodeClient | undefined {
  if (!isSentryConfigured()) return

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
