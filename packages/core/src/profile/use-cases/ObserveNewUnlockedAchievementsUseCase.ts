import { User } from '../../global/domain/entities'
import { Achievement } from '../domain/entities'
import type { UserDto } from '../../global/dtos'
import type { IProfileService, IUseCase } from '../../global/interfaces'

type Response = Promise<{
  newUnlockedAchievements: Achievement[]
  user: User
}>

type Request = {
  userDto: UserDto
}

export class ObserveNewUnlockedAchievementsUseCase
  implements IUseCase<Request, Response>
{
  private profileService: IProfileService

  constructor(profileService: IProfileService) {
    this.profileService = profileService
  }

  async do({ userDto }: Request) {
    const response = await this.profileService.fetchAchievements()
    if (response.isFailure) response.throwError()

    const user = User.create(userDto)
    const achievements = response.body.map(Achievement.create)

    const newUnlockedAchievements = achievements.filter((achievement) =>
      this.isNewUnlockedAchievement(achievement, user),
    )

    for (const { id } of newUnlockedAchievements) {
      const unlockedAchievementResponse =
        await this.profileService.saveUnlockedAchievement(id, user.id)

      if (unlockedAchievementResponse.isFailure) {
        unlockedAchievementResponse.throwError()
      }

      const rescuableAchievementResponse =
        await this.profileService.saveRescuableAchievement(id, user.id)

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
