import type { Achievement } from '@/@types/Achievement'

export type AchivementsContextValue = {
  achievements: Achievement[] | undefined
  rescueableAchievementsCount: number
  rescueAchivement: (
    rescuableAchiementId: string,
    rescuableAchiementReward: number
  ) => Promise<void>
  handleRescuedAchievementsAlertClose: (rescuedAchiementId: string) => void
}
