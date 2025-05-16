import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { RestResponse } from '@stardust/core/global/responses'
import type {
  AchievementsRepository,
  UsersRepository,
} from '@stardust/core/profile/interfaces'
import { _ObserveNewUnlockedAchievementsUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  routeParams: {
    userId: string
  }
}

export class ObserveNewUnlockedAchievementsController implements Controller<Schema> {
  constructor(
    private readonly achievementsRepository: AchievementsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async handle(http: Http<Schema>): Promise<RestResponse> {
    const { userId } = http.getRouteParams()
    const useCase = new _ObserveNewUnlockedAchievementsUseCase(
      this.usersRepository,
      this.achievementsRepository,
    )
    const response = await useCase.execute({ userId })
    return http.sendJson(response)
  }
}
