import type { UseCase } from '#global/interfaces/index'
import { Id } from '#global/domain/structures/Id'
import { UserNotFoundError } from '#profile/errors/UserNotFoundError'
import type { AchievementsRepository, UsersRepository } from '../interfaces'
import type { UserDto } from '../domain/entities/dtos'
import { AchievementNotFoundError } from '../errors'

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
    const achievement = await this.achievementsRepository.findById(
      Id.create(achievementId),
    )
    if (!achievement) throw new AchievementNotFoundError()

    const user = await this.usersRepository.findById(Id.create(userId))
    if (!user) throw new UserNotFoundError()

    await this.achievementsRepository.removeRescuable(achievement.id, user.id)

    user.rescueAchievement(achievement.id, achievement.reward)
    await this.usersRepository.replace(user)

    return user.dto
  }
}
