'use client'

import { useEffect, useRef, useState } from 'react'

import type { Achievement as AchievementData } from '@/@types/achievement'
import { AlertRef } from '@/app/components/Alert'
import { useAuthContext } from '@/contexts/AuthContext/hooks/useAuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useUserAchievements } from '@/hooks/useUserAchievements'
import { useApi } from '@/services/api'

export function useAchivementsProvider() {
  const { user, updateUser } = useAuthContext()
  const { userAchievements } = useUserAchievements(user?.id)
  const [achievements, setAchievements] = useState<AchievementData[]>([])
  const [newUnlockedAchievements, setNewUnlockedAchievements] = useState<
    AchievementData[]
  >([])
  const [rescueableAchievementsCount, setRescueableAchievementsCount] =
    useState(0)

  const api = useApi()
  const toast = useToast()

  const newUnlockedAchievementsAlertRef = useRef<AlertRef>(null)

  async function removeRescuedAchievement(achievementId: string) {
    if (!user) return

    try {
      await api.deleteUserRescuebleAchievement(achievementId, user.id)
    } catch (error) {
      console.error(error)
      toast.show('Erro ao resgatar a conquista', {
        type: 'error',
        seconds: 8,
      })
    }
  }

  async function rescueAchivement(
    rescuableAchievementId: string,
    rescuableAchievementReward: number
  ) {
    if (!user) return

    try {
      await Promise.all([
        removeRescuedAchievement(rescuableAchievementId),
        updateUser({ coins: user.coins + rescuableAchievementReward }),
      ])
      setRescueableAchievementsCount(rescueableAchievementsCount - 1)
    } catch (error) {
      toast.show('Erro ao tentar resgatar recompensa', {
        type: 'error',
        seconds: 8,
      })
      console.error(error)
    }
  }

  function handleRescuedAchievementsAlertClose(rescuedAchievementId: string) {
    const updatedAchievements = achievements.map((achievement) =>
      achievement.id === rescuedAchievementId
        ? { ...achievement, isRescuable: false }
        : achievement
    )

    setAchievements(updatedAchievements)
  }

  function handleNewUnlockedAchievementsAlertClose(isOpen: boolean) {
    if (!isOpen) {
      newUnlockedAchievementsAlertRef.current?.close()
      setNewUnlockedAchievements([])
    }
  }

  function addCurrentProgress(achievement: AchievementData) {
    if (!user) return achievement

    const currentProgress = user[achievement.metric]

    return { ...achievement, currentProgress }
  }

  function updateAchivement(
    achievement: AchievementData,
    newUnlockedAchievements: AchievementData[]
  ) {
    if (achievement.isUnlocked) return achievement

    const isUnlocked = newUnlockedAchievements.some(
      (unlockedAchievement) => unlockedAchievement.id === achievement.id
    )

    if (isUnlocked)
      setRescueableAchievementsCount(
        (rescueableAchievementsCount) => rescueableAchievementsCount + 1
      )

    return { ...achievement, isUnlocked, isRescuable: isUnlocked }
  }

  function isNewAchievementUnlocked(achievement: AchievementData) {
    if (!user || achievement.isUnlocked) return false

    switch (achievement.metric) {
      case 'unlocked_stars_count':
        return user.unlocked_stars_count >= achievement.required_count + 1
      case 'completed_planets_count':
        return user.completed_planets_count >= achievement.required_count
      case 'acquired_rockets_count':
        return user.acquired_rockets_count >= achievement.required_count
      case 'completed_challenges_count':
        return user.completed_challenges_count >= achievement.required_count
      case 'xp':
        return user.xp >= achievement.required_count
      case 'streak':
        return user.streak >= achievement.required_count
      default:
        return false
    }
  }

  async function checkNewUnlockedAchivements(achievements: AchievementData[]) {
    if (!achievements?.length || !user) return

    const newUnlockedAchievements = achievements.filter(
      isNewAchievementUnlocked
    )

    if (newUnlockedAchievements) {
      for (const { id } of newUnlockedAchievements) {
        await Promise.all([
          api.addUserUnlockedAchievement(id, user.id),
          api.addUserRescuableAchievements(id, user.id),
        ])
      }

      const updatedAchievements = achievements.map((achievement) =>
        updateAchivement(achievement, newUnlockedAchievements)
      )

      setAchievements(updatedAchievements)
      setNewUnlockedAchievements(newUnlockedAchievements)
    }
  }

  useEffect(() => {
    if (userAchievements && !achievements.length) {
      const achievements = userAchievements.map(addCurrentProgress)
      setAchievements(achievements)
      checkNewUnlockedAchivements(achievements)

      achievements.forEach((achievement) => {
        if (achievement.isRescuable)
          setRescueableAchievementsCount(
            (rescueableAchievementsCount) => rescueableAchievementsCount + 1
          )
      })
    }
  }, [userAchievements])

  useEffect(() => {
    checkNewUnlockedAchivements(achievements)
  }, [user])

  useEffect(() => {
    if (newUnlockedAchievements.length) {
      newUnlockedAchievementsAlertRef.current?.open()
    }
  }, [newUnlockedAchievements])

  return {
    achievements,
    newUnlockedAchievements,
    rescueableAchievementsCount,
    newUnlockedAchievementsAlertRef,
    rescueAchivement,
    handleRescuedAchievementsAlertClose,
    handleNewUnlockedAchievementsAlertClose,
  }
}
