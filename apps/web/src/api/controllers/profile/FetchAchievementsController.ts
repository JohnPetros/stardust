import type { IController, IHttp } from '@stardust/core/interfaces'
import type { IProfileService } from '@stardust/core/interfaces'

export const FetchAchievementsController = (service: IProfileService): IController => {
  return {
    async handle(http: IHttp) {
      const response = await service.fetchAchievements()
      if (response.isFailure) response.throwError()
      return http.send(response.body, 200)
    },
  }
}
