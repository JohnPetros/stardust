import { ReorderAchievementsUseCase } from '@stardust/core/profile/use-cases'
import type { Controller, Http } from '@stardust/core/global/interfaces'
import type { AchievementsRepository } from '@stardust/core/profile/interfaces'

type Schema = {
  body: {
    achievementIds: string[]
  }
}

export class ReorderAchievementsController implements Controller<Schema> {
  constructor(private readonly repository: AchievementsRepository) {}

  async handle(http: Http<Schema>) {
    const { achievementIds } = await http.getBody()
    const useCase = new ReorderAchievementsUseCase(this.repository)
    const response = await useCase.execute({ achievementIds })
    return http.statusOk().send(response)
  }
}
