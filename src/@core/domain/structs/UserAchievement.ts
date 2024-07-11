import type { Achievement } from '../entities'

type UserAchievementProps = {
  isRescuable: boolean
  currentProgress: number
  achievement: Achievement
}

export class UserAchievement extends BaseStruct<UserAchievementProps> {
  readonly currentProgress: number
  readonly isRescuable: boolean

  private constructor(props: UserAchievementProps) {
    super(props)
    this.currentProgress = props.currentProgress
    this.isRescuable = props.isRescuable
  }

  static create(props: UserAchievementProps): UserAchievement {
    return new UserAchievement(props)
  }

  makeRescuable() {
    return UserAchievement.create({
      ...this.props,
      isRescuable: true,
    })
  }

  makeUnrescuable() {
    return UserAchievement.create({
      ...this.props,
      isRescuable: false,
    })
  }
}
