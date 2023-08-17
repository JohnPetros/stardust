type Metric =
  | 'unlocked_stars'
  | 'acquired_rockets'
  | 'completed_challenges'
  | 'completed_planets'
  | 'xp'
  | 'streak'

export type Achievement = {
  id: string
  name: string
  icon: string
  description: string
  reward: number
  metric: Metric
  required_amount: number
  position: number
  isUnlocked: boolean
  isRescuable: boolean
  currentProgress?: number
}
