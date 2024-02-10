export type AchievementMetric =
  | 'unlockedStarsCount'
  | 'acquiredRocketsCount'
  | 'completedChallengesCount'
  | 'completedPlanetsCount'
  | 'xp'
  | 'streak'

export type Achievement = {
  id: string
  name: string
  icon: string
  description: string
  reward: number
  metric: AchievementMetric
  requiredCount: number
  position: number
  currentProgress?: number
  isUnlocked?: boolean
  isRescuable?: boolean
}
