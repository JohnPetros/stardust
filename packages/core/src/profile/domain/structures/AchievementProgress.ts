import { Integer } from '#global/domain/structures/index'

export class AchievementProgress {
  readonly userCount: Integer
  readonly requiredCount: Integer

  private constructor(userCount: Integer, requiredCount: Integer) {
    this.userCount = userCount
    this.requiredCount = requiredCount
  }

  static create(userCountValue: number, requiredCountValue: number): AchievementProgress {
    return new AchievementProgress(
      Integer.create(userCountValue, 'Contagem do usuário'),
      Integer.create(requiredCountValue, 'Contagem mínima exigida pela conquista'),
    )
  }

  get percentageProgress(): number {
    const percentageProgress = Math.min(
      (this.userCount.value / this.requiredCount.value) * 100,
      100,
    )

    return Math.max(0, percentageProgress)
  }

  get absoluteProgress() {
    const absoluteProgress =
      this.userCount.value && this.userCount.value >= this.requiredCount.value
        ? this.requiredCount.value
        : this.userCount.value

    return absoluteProgress
  }
}
