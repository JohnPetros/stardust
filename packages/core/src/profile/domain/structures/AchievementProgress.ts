import { Integer } from '../../../global/domain/structures'

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

  get percentageProgress() {
    const percentageProgress = (this.userCount.value / this.requiredCount.value) * 100

    return percentageProgress
  }

  get absoluteProgress() {
    const absoluteProgress =
      this.userCount.value && this.userCount.value >= this.requiredCount.value
        ? this.requiredCount.value
        : this.userCount.value

    return absoluteProgress
  }
}
