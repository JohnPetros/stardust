import type { UseCase } from '#global/interfaces/UseCase'
import type { AchievementDto } from '../domain/entities/dtos'
import type { AchievementsRepository } from '../interfaces'
import { Achievement } from '../domain/entities'

type Request = {
  achievementDto: AchievementDto
}

type Response = Promise<AchievementDto>

export class CreateAchievementUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: AchievementsRepository) {}

  async execute({ achievementDto }: Request): Response {
    const achievement = Achievement.create(achievementDto)
    await this.repository.add(achievement)
    return achievement.dto
  }
}
