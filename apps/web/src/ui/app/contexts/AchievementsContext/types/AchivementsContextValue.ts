import type { Achievement } from '@/@core/domain/entities'
import type { AchievementDto } from '#dtos'

export type AchivementsContextValue = {
  achievementsDto: AchievementDto[]
  newUnlockedAchievements: Achievement[]
  rescueAchivement: (
    rescuableAchiementId: string,
    rescuableAchiementReward: number,
  ) => Promise<void>
}
