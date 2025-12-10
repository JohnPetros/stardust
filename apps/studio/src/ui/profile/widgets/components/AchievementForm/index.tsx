import { useRest } from '@/ui/global/hooks/useRest'
import { AchievementFormView } from './AchievementFormView'
import type { PropsWithChildren } from 'react'
import type { AchievementDto } from '@stardust/core/profile/entities/dtos'

type Props = {
  achievementDto?: AchievementDto
  onSubmit: (data: {
    name: string
    icon: string
    description: string
    reward: number
    requiredCount: number
    metric: string
  }) => void
}

export const AchievementForm = ({
  children,
  achievementDto,
  onSubmit,
}: PropsWithChildren<Props>) => {
  const { storageService } = useRest()
  return (
    <AchievementFormView
      achievementDto={achievementDto}
      storageService={storageService}
      onSubmit={onSubmit}
    >
      {children}
    </AchievementFormView>
  )
}
