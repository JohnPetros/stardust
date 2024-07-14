import type { Achievement } from '@/@core/domain/entities'

export type AchivementsContextValue = {
  achievements: Achievement[]
  newUnlockedAchievements: Achievement[]
  rescueAchivement: (
    rescuableAchiementId: string,
    rescuableAchiementReward: number
  ) => Promise<void>
}
