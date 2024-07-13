import { BaseStruct } from '../abstracts'
import type { Integer } from './Integer'

type AchievementProgressProps = {
  userCount: Integer
  requiredCount: Integer
}

export class AchievementProgress extends BaseStruct<AchievementProgressProps> {
  readonly userCount: Integer
  readonly requiredCount: Integer

  private constructor(props: AchievementProgressProps) {
    super(props)
    this.userCount = props.userCount
    this.requiredCount = props.requiredCount
  }

  static create(props: AchievementProgressProps): AchievementProgress {
    return new AchievementProgress(props)
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
