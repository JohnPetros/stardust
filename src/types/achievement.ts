export type Achievement = {
  id: string
  name: string
  icon: string
  description: string
  reward: number
  metric: string
  required_amount: number
  position: number
  isUnlocked: boolean
  isRescuable: boolean
}
