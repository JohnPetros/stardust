import type { AchievementDto } from '@stardust/core/profile/entities/dtos'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { UpdateAchievementUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  routeParams: {
    achievementId: string
  }
  body: AchievementDto
}

export class UpdateAchievementController implements Controller<Schema> {
  constructor(private readonly repository: AchievementsRepository) {}

  async handle(http: Http<Schema>) {
    const { achievementId } = http.getRouteParams()
    const achievementDto = await http.getBody()
    achievementDto.id = achievementId
    const useCase = new UpdateAchievementUseCase(this.repository)
    const response = await useCase.execute({ achievementDto })
    return http.send(response)
  }
}
