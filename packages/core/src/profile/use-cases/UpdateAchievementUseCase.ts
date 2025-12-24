import type { UseCase } from '#global/interfaces/UseCase'
import type { AchievementsRepository } from '../interfaces'
import type { AchievementDto } from '../domain/entities/dtos'
import { Id } from '#global/domain/structures/Id'
import { Achievement } from '../domain/entities'
import { AchievementNotFoundError } from '../domain/errors'

type Request = {
  achievementDto: AchievementDto
}

type Response = Promise<AchievementDto>

export class UpdateAchievementUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: AchievementsRepository) {}

  async execute({ achievementDto }: Request): Response {
    const achievementId = Id.create(achievementDto.id)
    const currentAchievement = await this.findAchievement(achievementId)
    const achievement = Achievement.create(achievementDto)
    achievement.position = currentAchievement.position
    await this.repository.replace(achievement)
    return achievement.dto
  }

  private async findAchievement(achievementId: Id): Promise<Achievement> {
    const achievement = await this.repository.findById(achievementId)
    if (!achievement) throw new AchievementNotFoundError()
    return achievement
  }
}
