import { useCallback } from 'react'

import type { TelemetryProvider } from '@stardust/core/global/interfaces'

export function useTelemetryProvider(): TelemetryProvider {
  const trackError = useCallback((error: Error) => {
    console.error(error)
  }, [])

  return {
    trackError,
  }
}
