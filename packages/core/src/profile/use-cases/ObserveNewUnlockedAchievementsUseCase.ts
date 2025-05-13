import { User } from '../../global/domain/entities'
import { Achievement } from '../domain/entities'
import type { UseCase } from '../../global/interfaces'
import type { ProfileService } from '../interfaces'
import type { UserDto } from '../domain/entities/dtos'

type Response = Promise<{
  newUnlockedAchievements: Achievement[]
  user: User
}>

type Request = {
  userDto: UserDto
}

export class ObserveNewUnlockedAchievementsUseCase implements UseCase<Request, Response> {
  private profileService: ProfileService

  constructor(profileService: ProfileService) {
    this.profileService = profileService
  }

  async execute({ userDto }: Request) {
    const response = await this.profileService.fetchAchievements()
    if (response.isFailure) response.throwError()

    const user = User.create(userDto)
    const achievements = response.body.map(Achievement.create)

    const newUnlockedAchievements = achievements.filter((achievement) =>
      this.isNewUnlockedAchievement(achievement, user),
    )

    for (const { id } of newUnlockedAchievements) {
      const unlockedAchievementResponse =
        await this.profileService.saveUnlockedAchievement(id.value, user.id.value)

      if (unlockedAchievementResponse.isFailure) {
        unlockedAchievementResponse.throwError()
      }

      const rescuableAchievementResponse =
        await this.profileService.saveRescuableAchievement(id.value, user.id.value)

      if (rescuableAchievementResponse.isFailure) {
        rescuableAchievementResponse.throwError()
      }

      user.unlockAchievement(id)
    }

    return {
      newUnlockedAchievements,
      user,
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
}
