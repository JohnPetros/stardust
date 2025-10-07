import { ENV } from '@/constants'
import * as Sentry from '@sentry/node'

import type { TelemetryProvider } from '@stardust/core/global/interfaces'
import { AppError } from '@stardust/core/global/errors'

export class SentryTelemetryProvider implements TelemetryProvider {
  private readonly sentry: Sentry.NodeClient

  constructor() {
    const sentry = Sentry.init({
      dsn: ENV.sentryDsn,
    })
    if (!sentry) throw new AppError('Failed to initialize Sentry')

    console.log('🔍 Sentry initialized')

    this.sentry = sentry
  }

  trackError(error: Error): void {
    this.sentry.captureException(error)
  }
}
