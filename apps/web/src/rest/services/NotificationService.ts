import type { NotificationService as INotificationService } from '@stardust/core/notification/interfaces'
import type { RestClient } from '@stardust/core/global/interfaces'
import { MethodNotImplementedError } from '@stardust/core/global/errors'

export const NotificationService = (restClient: RestClient): INotificationService => {
  return {
    async sendPlanetCompletedNotification() {
      throw new MethodNotImplementedError('sendPlanetCompletedNotification')
    },

    async sendSpaceCompletedNotification() {
      throw new MethodNotImplementedError('sendSpaceCompletedNotification')
    },

    async sendErrorNotification(_, errorMessage: string) {
      return await restClient.post('/notification/error', {
        message: errorMessage,
      })
    },
  }
}
