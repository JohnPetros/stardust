import type { UseCase } from '#global/interfaces/UseCase'
import type { Id } from '#global/domain/structures/Id'
import type { AchievementsRepository } from '../interfaces'
import type { AchievementDto } from '../domain/entities/dtos'
import { Achievement } from '../domain/entities'
import { AchievementNotFoundError } from '../domain/errors'

type Request = {
  achievementDto: AchievementDto
}

type Response = Promise<AchievementDto>

export class UpdateAchievementUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: AchievementsRepository) {}

  async execute({ achievementDto }: Request): Response {
    const achievement = Achievement.create(achievementDto)
    await this.findAchievement(achievement.id)
    await this.repository.replace(achievement)
    return achievement.dto
  }

  private async findAchievement(achievementId: Id): Promise<Achievement> {
    const achievement = await this.repository.findById(achievementId)
    if (!achievement) throw new AchievementNotFoundError()
    return achievement
  }
}
