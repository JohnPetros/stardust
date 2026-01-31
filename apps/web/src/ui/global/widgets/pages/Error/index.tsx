'use client'

import { useRestContext } from '@/ui/global/contexts/RestContext'
import { useTelemetryProvider } from '../../../hooks/useTelemetryProvider'
import { ErrorPageView } from './ErrorPageView'
import { useErrorPage } from './useErrorPage'

type Props = {
  error: Error
}

export const ErrorPage = ({ error }: Props) => {
  const telemetryProvider = useTelemetryProvider()
  const { notificationService } = useRestContext()
  const { handleReload } = useErrorPage({ telemetryProvider, notificationService, error })

  return <ErrorPageView errorMessage={error.message} onReload={handleReload} />
}
