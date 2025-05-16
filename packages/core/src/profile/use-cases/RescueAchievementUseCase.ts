import { Id } from '#global/domain/structures/Id'
import { UserNotFoundError } from '#profile/errors/UserNotFoundError'
import type { AchievementsRepository, UsersRepository } from '../interfaces'
import type { UserDto } from '../domain/entities/dtos'
import { AchievementNotFoundError } from '../errors'

export class RescueAchievementUseCase {
  constructor(
    private readonly repository: AchievementsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(achievementId: string, userId: string): Promise<UserDto> {
    const achievement = await this.repository.findById(Id.create(achievementId))
    if (!achievement) {
      throw new AchievementNotFoundError()
    }

    const user = await this.usersRepository.findById(Id.create(userId))
    if (!user) {
      throw new UserNotFoundError()
    }

    await this.repository.removeRescuable(achievement.id, user.id)

    user.rescueAchievement(achievement.id, achievement.reward)
    await this.usersRepository.replace(user)

    return user.dto
  }
}
