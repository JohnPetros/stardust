import { Achievement, User } from '@/@core/domain/entities'
import type { AchievementDTO, UserDTO } from '@/@core/dtos'
import type { IUseCase } from '@/@core/interfaces/handlers'
import type { IAchievementsService, IUsersService } from '@/@core/interfaces/services'

type Response = {
  newUnlockedAchievements: Achievement[]
  user: User
}

type Request = {
  achievementsDTO: AchievementDTO[]
  userDTO: UserDTO
}

export class ObserveNewUnlockedAchievementsUseCase
  implements IUseCase<Request, Promise<Response>>
{
  private achievementsService: IAchievementsService

  constructor(achievementsService: IAchievementsService) {
    this.achievementsService = achievementsService
  }

  async do({ userDTO, achievementsDTO }: Request): Promise<Response> {
    const user = User.create(userDTO)
    const achievements = achievementsDTO.map(Achievement.create)

    const newUnlockedAchievements = achievements.filter((achievement) =>
      this.isNewUnlockedAchievement(achievement, user)
    )

    for (const { id, reward } of newUnlockedAchievements) {
      const unlockedAchievementResponse =
        await this.achievementsService.saveUnlockedAchievement(id, user.id)

      if (unlockedAchievementResponse.isFailure) {
        unlockedAchievementResponse.throwError()
      }

      const rescuableAchievementResponse =
        await this.achievementsService.saveRescuableAchievement(id, user.id)

      if (rescuableAchievementResponse.isFailure) {
        rescuableAchievementResponse.throwError()
      }

      user.unlockAchievement(id)
      user.earnCoins(reward.value)
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
