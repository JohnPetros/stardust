import type { AchievementDto } from '@stardust/core/profile/entities/dtos'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import { CreateAchievementUseCase } from '@stardust/core/profile/use-cases'

type Schema = {
  body: AchievementDto
}

export class CreateAchievementController implements Controller<Schema> {
  constructor(private readonly repository: AchievementsRepository) {}

  async handle(http: Http<Schema>) {
    const achievementDto = await http.getBody()
    const useCase = new CreateAchievementUseCase(this.repository)
    const response = await useCase.execute({ achievementDto })
    return http.statusCreated().send(response)
  }
}
