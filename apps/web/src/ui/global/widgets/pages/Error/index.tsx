'use client'

import { useTelemetryProvider } from '../../../hooks/use-telemetry'
import { useRest } from '../../../hooks/useRest'
import { ErrorPageView } from './ErrorPageView'
import { useErrorPage } from './useErrorPage'

type Props = {
  error: Error
}

export const ErrorPage = ({ error }: Props) => {
  const telemetryProvider = useTelemetryProvider()
  const { notificationService } = useRest()
  const { handleReload } = useErrorPage({ telemetryProvider, notificationService, error })

  return <ErrorPageView errorMessage={error.message} onReaload={handleReload} />
}
