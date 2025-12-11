import { OrdinalNumber } from '#global/domain/structures/OrdinalNumber'
import type { UseCase } from '#global/interfaces/UseCase'
import type { AchievementsRepository } from '../interfaces/AchievementsRepository'
import type { Achievement } from '../domain/entities/Achievement'
import type { AchievementDto } from '../domain/entities/dtos/AchievementDto'
import { AchievementNotFoundError } from '../domain/errors'
import { ConflictError } from '#global/domain/errors/ConflictError'

type Request = {
  achievementIds: string[]
}

type Response = Promise<AchievementDto[]>

export class ReorderAchievementsUseCase implements UseCase<Request, Response> {
  constructor(private readonly repository: AchievementsRepository) {}

  async execute({ achievementIds }: Request): Response {
    const achievements = await this.repository.findAll()
    const reorderedAchievements: Achievement[] = []

    if (new Set(achievementIds).size !== achievementIds.length) {
      throw new ConflictError('Todos os IDs das conquistas devem ser fornecidos e únicos')
    }

    for (let number = 1; number <= achievementIds.length; number++) {
      const achievementId = achievementIds[number - 1]
      const achievement = achievements.find(
        (achievement) => achievement.id.value === achievementId,
      )
      if (!achievement) throw new AchievementNotFoundError()

      achievement.position = OrdinalNumber.create(number)
      reorderedAchievements.push(achievement)
    }

    await this.repository.replaceMany(reorderedAchievements)
    return reorderedAchievements.map((achievement) => achievement.dto)
  }
}
