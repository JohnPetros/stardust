import type { AchievementDto } from '@stardust/core/profile/dtos'
import type { Achievement } from '@stardust/core/profile/entities'

export type AchivementsContextValue = {
  achievementsDto: AchievementDto[]
  newUnlockedAchievements: Achievement[]
  rescueAchivement: (
    rescuableAchiementId: string,
    rescuableAchiementReward: number,
  ) => Promise<void>
}
