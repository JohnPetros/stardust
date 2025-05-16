import { Id } from '#global/domain/structures/Id'
import type { UseCase } from '#global/interfaces/index'
import type { AchievementDto, UserDto } from '../domain/entities/dtos'
import type { AchievementsRepository, UsersRepository } from '../interfaces'
import type { User, Achievement } from '../domain/entities/index'
import { UserNotFoundError } from '../errors'

type Response = Promise<{
  newUnlockedAchievements: AchievementDto[]
  user: UserDto
}>

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

    const newUnlockedAchievements = achievements.filter((achievement) =>
      this.isNewUnlockedAchievement(achievement, user),
    )

    for (const achievement of newUnlockedAchievements) {
      await Promise.all([
        this.achievementsRepository.addUnlocked(achievement, user.id),
        this.achievementsRepository.addRescuable(achievement, user.id),
      ])
      user.unlockAchievement(achievement.id)
    }

    return {
      newUnlockedAchievements: newUnlockedAchievements.map(
        (achievement) => achievement.dto,
      ),
      user: user.dto,
    }
  }

  private isNewUnlockedAchievement(achievement: Achievement, user: User) {
    const isUnlocked = user.hasUnlockedAchievement(achievement.id)

    if (isUnlocked) return false

    switch (achievement.metric.value) {
      case 'unlockedStarsCount':
        return user.unlockedStarsCount.value >= achievement.requiredCount.value
      case 'completedPlanetsCount':
        return user.completedPlanetsCount.value >= achievement.requiredCount.value
      case 'acquiredRocketsCount':
        return user.acquiredRocketsCount.value >= achievement.requiredCount.value
      case 'completedChallengesCount':
        return user.completedChallengesCount.value >= achievement.requiredCount.value
      case 'xp':
        return user.xp.value >= achievement.requiredCount.value
      case 'streak':
        return user.streak.value >= achievement.requiredCount.value
      default:
        return false
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
