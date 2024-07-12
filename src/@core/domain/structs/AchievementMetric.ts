import { StringValidation } from '@/@core/lib/validation'

import { BaseStruct } from '../abstracts'

type Metric =
  | 'unlockedStarsCount'
  | 'acquiredRocketsCount'
  | 'completedChallengesCount'
  | 'completedPlanetsCount'
  | 'xp'
  | 'streak'

type AchievementMetricProps = {
  value: string
}

export class AchievementMetric extends BaseStruct<AchievementMetricProps> {
  readonly value: Metric

  private constructor(value: Metric) {
    super({ value: String(value) })

    this.value = value
  }

  static create(value: string) {
    if (AchievementMetric.isMetric(value)) {
      return new AchievementMetric(value)
    }

    return null as unknown as AchievementMetric
  }

  static isMetric(value: string): value is Metric {
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
