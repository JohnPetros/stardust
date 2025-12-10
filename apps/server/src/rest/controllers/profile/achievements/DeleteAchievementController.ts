import type { AchievementsRepository } from '@stardust/core/profile/interfaces'
import { DeleteAchievementUseCase } from '@stardust/core/profile/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'

type Schema = {
  routeParams: {
    achievementId: string
  }
}

export class DeleteAchievementController implements Controller<Schema> {
  constructor(private readonly repository: AchievementsRepository) {}

  async handle(http: Http<Schema>) {
    const { achievementId } = http.getRouteParams()
    const useCase = new DeleteAchievementUseCase(this.repository)
    await useCase.execute({ achievementId })
    return http.statusNoContent().send()
  }
}
