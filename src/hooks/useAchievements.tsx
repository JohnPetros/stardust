import { api } from '@/services/api'
import { Achievement } from '@/types/achievement'
import { useMemo } from 'react'
import useSWR from 'swr'

async function getUserUnlockedAchievementsIds(userId: string) {
  if (userId) {
    return await api.getUserUnlockedAchievementsIds(userId)
  }
}

async function getUserRescuableAchievementsIds(userId: string) {
  if (userId) {
    return await api.getUserRescuableAchievementsIds(userId)
  }
}

function verifyAchievement(
  achievement: Achievement,
  userUnlockedAchievementsIds: string[],
  userRescuableAchievementsIds: string[]
) {
  const isUnlocked = userUnlockedAchievementsIds.some(
    (unlockedAchievementId) => unlockedAchievementId === achievement.id
  )

  const isRescuable = userRescuableAchievementsIds.some(
    (rescuableachievementId) => rescuableachievementId === achievement.id
  )

  return { ...achievement, isUnlocked, isRescuable }
}

export function useAchievement(userId?: string) {
  const { data: achievements } = useSWR('achievements', api.getAchievements)
  const { data: userUnlockedAchievementsIds } = useSWR(
    'achievements',
    getUserUnlockedAchievementsIds
  )
  const { data: userRescuableAchievementsIds } = useSWR(
    'achievements',
    getUserRescuableAchievementsIds
  )

  const verifiedAchievements = useMemo(() => {
    if (
      userId &&
      achievements &&
      userUnlockedAchievementsIds &&
      userRescuableAchievementsIds
    ) {
      return achievements.map((achievement) =>
        verifyAchievement(
          achievement,
          userUnlockedAchievementsIds,
          userRescuableAchievementsIds
        )
      )
    }
  }, [
    userId,
    achievements,
    userUnlockedAchievementsIds,
    userRescuableAchievementsIds,
  ])

  return { achievements: verifiedAchievements }
}
