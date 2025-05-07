import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { ProfileService } from '@stardust/core/profile/interfaces'

export const FetchAchievementsController = (service: ProfileService): Controller => {
  return {
    async handle(http: Http) {
      const response = await service.fetchAchievements()
      if (response.isFailure) response.throwError()
      return http.send(response.body, 200)
    },
  }
}
