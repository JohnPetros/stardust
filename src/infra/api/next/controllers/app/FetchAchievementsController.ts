import type { IController, IHttp } from '@/@core/interfaces/handlers'
import type { IAchievementsService } from '@/@core/interfaces/services'

export const FetchAchievementsController = (
  service: IAchievementsService
): IController => {
  return {
    async handle(http: IHttp) {
      const achievements = await service.fetchAchievements()

      if (achievements.isSuccess) {
        return http.send(achievements.data, 200)
      }

      return http.send(achievements.errorMessage, 500)
    },
  }
}
