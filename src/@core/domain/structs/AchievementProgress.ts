import { BaseStruct } from '../abstracts'

type AchievementProgressProps = {
  userCountValue: number
  RequiredCountValue: number
}

export class AchievementProgress extends BaseStruct<AchievementProgressProps> {
  readonly userCountValue: number
  readonly RequiredCountValue: number

  private constructor(props: AchievementProgressProps) {
    super(props)
    this.userCountValue = props.userCountValue
    this.RequiredCountValue = props.RequiredCountValue
  }

  static create(props: AchievementProgressProps): AchievementProgress {
    return new AchievementProgress(props)
  }

  get percentageProgress() {
    const percentageProgress = (this.userCountValue / this.RequiredCountValue) * 100

    return percentageProgress
  }

  get absoluteProgress() {
    const absoluteProgress =
      this.userCountValue && this.userCountValue >= this.RequiredCountValue
        ? this.RequiredCountValue
        : this.userCountValue

    return absoluteProgress
  }

  validate(): void {}
}
