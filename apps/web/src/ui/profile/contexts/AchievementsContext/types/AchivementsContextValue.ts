import type { Achievement } from '@stardust/core/profile/entities'
import type { AchievementDto } from '@stardust/core/profile/entities/dtos'

export type AchivementsContextValue = {
  achievementsDto: AchievementDto[]
  newUnlockedAchievements: Achievement[]
  rescueAchivement: (
    rescuableAchiementId: string,
    rescuableAchiementReward: number,
  ) => Promise<void>
}
