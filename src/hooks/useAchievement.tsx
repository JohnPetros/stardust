'use client'

import { api } from '@/services/api'
import { Achievement } from '@/types/achievement'
import { useMemo } from 'react'
import useSWR from 'swr'
import { useAuth } from './useAuth'

export function useAchievement(userId?: string) {
  const { user } = useAuth()

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

  const { data: achievements } = useSWR('/achievements', api.getAchievements)
  const { data: userUnlockedAchievementsIds } = useSWR(
    '/unlocked_achievements_ids?id=' + user?.id,
    getUserUnlockedAchievementsIds
  )
  const { data: userRescuableAchievementsIds } = useSWR(
    '/rescuableachievements_ids?user_id=' + user?.id,
    getUserRescuableAchievementsIds
  )

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
