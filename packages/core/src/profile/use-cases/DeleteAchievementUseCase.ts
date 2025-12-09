import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/UseCase'
import { AchievementNotFoundError } from '../domain/errors'
import type { AchievementsRepository } from '../interfaces'

type Request = {
  achievementId: string
}

type Response = Promise<void>

export class DeleteAchievementUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: AchievementsRepository) {}

  async execute({ achievementId }: Request): Response {
    const achievement = await this.findAchievement(Id.create(achievementId))
    await this.repository.remove(achievement)
    return undefined
  }

  private async findAchievement(achievementId: Id) {
    const achievement = await this.repository.findById(achievementId)
    if (!achievement) throw new AchievementNotFoundError()
    return achievement
  }
}
