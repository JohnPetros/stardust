import { useEffect } from 'react'

import type { TelemetryProvider } from '@stardust/core/global/interfaces'
import type { NotificationService } from '@stardust/core/notification/interfaces'
import { CLIENT_ENV } from '@/constants'

type Params = {
  telemetryProvider: TelemetryProvider
  notificationService: NotificationService
  error: Error
}

export function useErrorPage({ telemetryProvider, notificationService, error }: Params) {
  function handleReload() {
    window.location.href = '/'
  }

  useEffect(() => {
    if (CLIENT_ENV.mode === 'development') return

    async function sendErrorNotification() {
      await notificationService.sendErrorNotification('web', error.message)
    }
    telemetryProvider.trackError(error)
    sendErrorNotification()
  }, [error])

  return {
    handleReload,
  }
}
