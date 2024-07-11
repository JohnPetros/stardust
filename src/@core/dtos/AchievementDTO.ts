import type { AchievementMetric } from '../domain/types'

export type AchievementDTO = {
  id: string
  name: string
  icon: string
  description: string
  reward: number
  requiredCount: number
  position: number
  metric: AchievementMetric
}
