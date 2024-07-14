import { StringValidation } from '@/@core/lib/validation'

import { BaseStruct } from '../abstracts'

type AchievementMetricProps = {
  value: string
}

export class AchievementMetric extends BaseStruct<AchievementMetricProps> {
  readonly value: AchievementMetricValue

  private constructor(value: AchievementMetricValue) {
    super({ value: String(value) })

    this.value = value
  }

  static create(value: string) {
    if (AchievementMetric.isMetric(value)) {
      return new AchievementMetric(value)
    }

    return null as unknown as AchievementMetric
  }

  static isMetric(value: string): value is AchievementMetricValue {
    new StringValidation(value, 'Achievement Metric')
      .oneOf([
        'unlockedStarsCount',
        'acquiredRocketsCount',
        'completedChallengesCount',
        'completedPlanetsCount',
        'xp',
        'streak',
      ])
      .validate()

    return true
  }
}
