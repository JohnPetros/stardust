import { Achievement, User } from '@/@core/domain/entities'
import type { AchievementDTO, UserDTO } from '@/@core/dtos'
import type { IUseCase } from '@/@core/interfaces/handlers'

type Request = AchievementDTO[]

type Response = {
  newUnlockedAchievements: Achievement[]
  user: User
}

export class GetNewUnlockedAchievementsUseCase implements IUseCase<Request, Response> {
  private user: User

  constructor(userDTO: UserDTO) {
    this.user = User.create(userDTO)
  }

  do(achievementsDTO: Request): Response {
    const achivements = achievementsDTO.map(Achievement.create)

    const newUnlockedAchievements = achivements.filter(this.isNewUnlockedAchievement)

    for (const { id } of newUnlockedAchievements) this.user.unlockAchievement(id)

    return {
      newUnlockedAchievements,
      user: this.user,
    }
  }

  private isNewUnlockedAchievement(achievement: Achievement) {
    const isUnlocked = this.user.hasUnlockedAchievement(achievement.id)

    if (isUnlocked) return false

    switch (achievement.metric.value) {
      case 'unlockedStarsCount':
        return this.user.unlockedStarsCount.value >= achievement.requiredCount.value + 1
      case 'completedPlanetsCount':
        return this.user.completedPlanetsCount.value >= achievement.requiredCount.value
      case 'acquiredRocketsCount':
        return this.user.acquiredRocketsCount.value >= achievement.requiredCount.value
      case 'completedChallengesCount':
        return this.user.completedChallengesCount.value >= achievement.requiredCount.value
      case 'xp':
        return this.user.xp.value >= achievement.requiredCount.value
      case 'streak':
        return this.user.streak.value >= achievement.requiredCount.value
      default:
        return false
    }
  }
}
