import type { Achievement } from '@/@core/domain/entities'
import type { AchievementDTO } from '@/@core/dtos'

export type AchivementsContextValue = {
  achievementsDTO: AchievementDTO[]
  newUnlockedAchievements: Achievement[]
  rescueAchivement: (
    rescuableAchiementId: string,
    rescuableAchiementReward: number
  ) => Promise<void>
}
