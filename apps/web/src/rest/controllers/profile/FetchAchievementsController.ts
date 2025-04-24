import type { IController, IHttp } from '@stardust/core/global/interfaces'
import type { ProfileService } from '@stardust/core/global/interfaces'

export const FetchAchievementsController = (service: ProfileService): IController => {
  return {
    async handle(http: IHttp) {
      const response = await service.fetchAchievements()
      if (response.isFailure) response.throwError()
      return http.send(response.body, 200)
    },
  }
}
