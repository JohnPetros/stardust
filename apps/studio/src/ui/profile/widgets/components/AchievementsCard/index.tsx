import { AchievementsCardView } from './AchievementsCardView'
import type { AchievementDto } from '@stardust/core/profile/entities/dtos'

type Props = {
  achievement: AchievementDto
  onUpdate: (data: {
    name: string
    icon: string
    description: string
    reward: number
    requiredCount: number
    metric: string
  }) => void
  onDelete: () => void
}

export const AchievementsCard = ({ achievement, onUpdate, onDelete }: Props) => {
  return (
    <AchievementsCardView
      achievement={achievement}
      onUpdate={onUpdate}
      onDelete={onDelete}
    />
  )
}
