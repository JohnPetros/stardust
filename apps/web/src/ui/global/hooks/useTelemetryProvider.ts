import { useCallback } from 'react'
import * as Sentry from '@sentry/nextjs'

import type { TelemetryProvider } from '@stardust/core/global/interfaces'

export function useTelemetryProvider(): TelemetryProvider {
  const trackError = useCallback((error: Error) => {
    Sentry.captureException(error)
  }, [])

  return {
    trackError,
  }
}
