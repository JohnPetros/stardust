type Metric =
  | 'unlocked_stars_count'
  | 'acquired_rockets_count'
  | 'completed_challenges_count'
  | 'completed_planets_count'
  | 'xp'
  | 'streak'

export type Achievement = {
  id: string
  name: string
  icon: string
  description: string
  reward: number
  metric: Metric
  required_count: number
  position: number
  isUnlocked?: boolean
  isRescuable?: boolean
  currentProgress?: number
}
