import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/index'
import type { AchievementDto, UserDto } from '../domain/entities/dtos'
import type { AchievementsRepository, UsersRepository } from '../interfaces'
import type { User, Achievement } from '../domain/entities/index'
import { UserNotFoundError } from '../errors'
import { Logical } from '#global/domain/structures/Logical'

type Response = Promise<AchievementDto[]>

type Request = {
  userId: string
}

export class _ObserveNewUnlockedAchievementsUseCase
  implements UseCase<Request, Response>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly achievementsRepository: AchievementsRepository,
  ) {}

  async execute({ userId }: Request) {
    const user = await this.findUser(userId)
    const achievements = await this.achievementsRepository.findAll()

    const newUnlockedAchievements = achievements.filter(
      (achievement) => this.isNewUnlockedAchievement(achievement, user).isTrue,
    )

    for (const achievement of newUnlockedAchievements) {
      await Promise.all([
        this.achievementsRepository.addUnlocked(achievement, user.id),
        this.achievementsRepository.addRescuable(achievement, user.id),
      ])
      user.unlockAchievement(achievement.id)
    }

    await this.usersRepository.replace(user)

    return newUnlockedAchievements.map((achievement) => achievement.dto)
  }

  private isNewUnlockedAchievement(achievement: Achievement, user: User): Logical {
    const isUnlocked = user.hasUnlockedAchievement(achievement.id)

    if (isUnlocked.isTrue) return Logical.createAsFalse()

    switch (achievement.metric.value) {
      case 'unlockedStarsCount':
        return user.unlockedStarsCount.isGreaterThanOrEqualTo(achievement.requiredCount)
      case 'completedPlanetsCount':
        return user.completedPlanetsCount.isGreaterThanOrEqualTo(
          achievement.requiredCount,
        )
      case 'acquiredRocketsCount':
        return user.acquiredRocketsCount.isGreaterThanOrEqualTo(achievement.requiredCount)
      case 'completedChallengesCount':
        return user.completedChallengesCount.isGreaterThanOrEqualTo(
          achievement.requiredCount,
        )
      case 'xp':
        return user.xp.isGreaterThanOrEqualTo(achievement.requiredCount)
      case 'streak':
        return user.streak.isGreaterThanOrEqualTo(achievement.requiredCount)
      default:
        return Logical.createAsFalse()
    }
  }

  private async findUser(userId: string) {
    const user = await this.usersRepository.findById(Id.create(userId))
    if (!user) {
      throw new UserNotFoundError()
    }
    return user
  }
}
