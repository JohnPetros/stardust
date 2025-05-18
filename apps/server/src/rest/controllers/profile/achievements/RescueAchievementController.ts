import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type {
  AchievementsRepository,
  UsersRepository,
} from '@stardust/core/profile/interfaces'
import { RescueAchievementUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  routeParams: {
    userId: string
    achievementId: string
  }
}

export class RescueAchievementController implements Controller<Schema> {
  constructor(
    private readonly achievementsRepository: AchievementsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { userId, achievementId } = http.getRouteParams()
    const useCase = new RescueAchievementUseCase(
      this.achievementsRepository,
      this.usersRepository,
    )
    const response = await useCase.execute({ achievementId, userId })
    return http.sendJson(response)
  }
}
