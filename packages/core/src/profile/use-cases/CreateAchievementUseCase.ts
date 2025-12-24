import type { UseCase } from '#global/interfaces/UseCase'
import type { AchievementDto } from '../domain/entities/dtos'
import type { AchievementsRepository } from '../interfaces'
import { Achievement } from '../domain/entities'
import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'

type Request = {
  achievementDto: AchievementDto
}

type Response = Promise<AchievementDto>

export class CreateAchievementUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: AchievementsRepository) {}

  async execute({ achievementDto }: Request): Response {
    const lastAchievementPosition = await this.findLastAchievementPosition()
    const achievement = Achievement.create({
      ...achievementDto,
      position: lastAchievementPosition.value,
    })
    await this.repository.add(achievement)
    return achievement.dto
  }

  private async findLastAchievementPosition() {
    const achievement = await this.repository.findLastByPosition()
    if (!achievement) return OrdinalNumber.create(1)
    return achievement.position.increment()
  }
}
