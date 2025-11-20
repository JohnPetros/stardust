import type { UseCase } from '#global/interfaces/index'
import { Id } from '#global/domain/structures/Id'
import { UserNotFoundError } from '#profile/domain/errors/UserNotFoundError'
import type { AchievementsRepository, UsersRepository } from '../interfaces'
import type { UserDto } from '../domain/entities/dtos'
import { AchievementNotFoundError } from '../domain/errors'

type Request = {
  achievementId: string
  userId: string
}

type Response = Promise<UserDto>

export class RescueAchievementUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly achievementsRepository: AchievementsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute({ achievementId, userId }: Request): Promise<UserDto> {
    const achievement = await this.findAchievement(achievementId)
    const user = await this.findUser(userId)
    if (user.hasRescuableAchievement(achievement.id).isTrue) {
      await this.usersRepository.removeRescuableAchievement(achievement.id, user.id)
      user.rescueAchievement(achievement.id, achievement.reward)
      await this.usersRepository.replace(user)
    }
    return user.dto
  }

  private async findAchievement(achievementId: string) {
    const achievement = await this.achievementsRepository.findById(
      Id.create(achievementId),
    )
    if (!achievement) {
      throw new AchievementNotFoundError()
    }
    return achievement
  }

  private async findUser(userId: string) {
    const user = await this.usersRepository.findById(Id.create(userId))
    if (!user) {
      throw new UserNotFoundError()
    }
    return user
  }
}
