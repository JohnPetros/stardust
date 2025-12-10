import type { UseCase } from '#global/interfaces/UseCase'
import type { AchievementDto } from '../domain/entities/dtos'
import type { AchievementsRepository } from '../interfaces'
import { Achievement } from '../domain/entities'
import { AchievementNotFoundError } from '../domain/errors'

type Request = {
  achievementDto: AchievementDto
}

type Response = Promise<AchievementDto>

export class CreateAchievementUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: AchievementsRepository) {}

  async execute({ achievementDto }: Request): Response {
    const lastAchievement = await this.findLastAchievement()
    const achievement = Achievement.create({
      ...achievementDto, 
      position: lastAchievement.position.increment().value,
    })
    await this.repository.add(achievement)
    return achievement.dto
  }

  private async findLastAchievement() {
    const achievement = await this.repository.findLastByPosition()
    if (!achievement) throw new AchievementNotFoundError()
    return achievement
  }
}
