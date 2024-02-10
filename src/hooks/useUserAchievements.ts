'use client'

import type { Achievement } from '@/@types/Achievement'
import { useApi } from '@/services/api'
import { useCache } from '@/services/cache'
import { CACHE } from '@/utils/constants/cache'

export function useUserAchievements(userId?: string) {
  const api = useApi()

  function verifyAchievement(
    achievement: Achievement,
    userUnlockedAchievementsIds: string[],
    userRescuableAchievementsIds: string[]
  ): Achievement {
    const isUnlocked = userUnlockedAchievementsIds.some(
      (unlockedAchievementId) => unlockedAchievementId === achievement.id
    )

    const isRescuable = userRescuableAchievementsIds.some(
      (rescuableachievementId) => rescuableachievementId === achievement.id
    )

    return { ...achievement, isUnlocked, isRescuable }
  }

  async function getUserAchievements() {
    if (userId) {
      const userUnlockedAchievementsIds =
        await api.getUserUnlockedAchievementsIds(userId)
      const userRescuableAchievementsIds =
        await api.getUserRescuableAchievementsIds(userId)

      const achievements = await api.getAchievements()

      return achievements.map((achievement) =>
        verifyAchievement(
          achievement,
          userUnlockedAchievementsIds,
          userRescuableAchievementsIds
        )
      )
    }
  }

  const { data } = useCache<Achievement[]>({
    key: CACHE.keys.userAchievements,
    fetcher: getUserAchievements,
    dependencies: [userId],
  })

  return { userAchievements: data }
}
