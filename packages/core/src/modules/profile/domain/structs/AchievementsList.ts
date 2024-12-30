import type { UserDto } from '#global/dtos'
import type { AchievementDto } from '#profile/dtos'
import { Achievement } from '#profile/entities'
import { User } from '#global/entities'

export class AchievementsList {
  readonly achievements: Achievement[]
  readonly user: User

  private constructor(achievements: Achievement[], user: User) {
    this.achievements = achievements
    this.user = user
  }

  static create(achievementsDto: AchievementDto[], userDto: UserDto) {
    const achievements = achievementsDto.map(Achievement.create)
    const user = User.create(userDto)

    return new AchievementsList(achievements, user)
  }

  orderAchievementsByLockingState() {
    return new AchievementsList(
      this.achievements.sort((a, b) => this.sortByLockingState(a, b)),
      this.user,
    )
  }

  orderAchievementsByUnLockingState() {
    return new AchievementsList(
      this.achievements.sort((a, b) => this.sortByUnLockingState(a, b)),
      this.user,
    )
  }

  orderAchievementsByPosition() {
    return new AchievementsList(
      this.achievements.sort((a, b) => this.sortAchievementsByPosition(a, b)),
      this.user,
    )
  }

  filterAchievementsByName(name: string) {
    return new AchievementsList(
      this.achievements.filter((achievement) => achievement.name.isLike(name)),
      this.user,
    )
  }

  private sortAchievementsByPosition(
    previousAchievement: Achievement,
    nextAchievement: Achievement,
  ) {
    return previousAchievement.position.value - nextAchievement.position.value
  }

  private sortByLockingState(
    previousAchievement: Achievement,
    nextAchievement: Achievement,
  ) {
    if (!this.isUnlocked(previousAchievement) && this.isUnlocked(nextAchievement)) {
      return -1
    }

    if (this.isUnlocked(previousAchievement) && !this.isUnlocked(nextAchievement)) {
      return 1
    }

    return 0
  }

  private sortByUnLockingState(
    previousAchievement: Achievement,
    nextAchievement: Achievement,
  ) {
    if (this.isUnlocked(previousAchievement) && !this.isUnlocked(nextAchievement)) {
      return -1
    }

    if (!this.isUnlocked(previousAchievement) && this.isUnlocked(nextAchievement)) {
      return 1
    }

    return 0
  }

  private isUnlocked(achievement: Achievement) {
    return this.user.hasUnlockedAchievement(achievement.id)
  }
}
