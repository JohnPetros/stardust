import { ReactNode, createContext, useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAchievement } from '@/hooks/useAchievement'
import { Achievement } from '@/types/achievement'
import { useApi } from '@/services/api'

import { useSWRConfig } from 'swr'

interface AchivementsContextValue {
  achievements: Achievement[] | undefined
}

interface AchivementsContextProps {
  children: ReactNode
}

export const AchivementsContext = createContext({} as AchivementsContextValue)

export function AchivementsProvider({ children }: AchivementsContextProps) {
  const { user } = useAuth()
  const { achievements: data } = useAchievement(user?.id)
  const [achievements, setAchievements] = useState<Achievement[]>(data ?? [])
  const [newUnlockedAchievements, setNewUnlockedAchievements] = useState<
    Achievement[]
  >([])

  const api = useApi()

  const { cache } = useSWRConfig()

  function addCurrentProgress(achievement: Achievement) {
    if (!user) return achievement

    const currentProgress = user[achievement.metric]

    return { ...achievement, currentProgress }
  }

  function updateAchivement(
    achievement: Achievement,
    newUnlockedAchievements: Achievement[]
  ) {
    if (achievement.isUnlocked) return achievement

    const isUnlocked = newUnlockedAchievements.some(
      (unlockedAchievement) => unlockedAchievement.id === achievement.id
    )

    return { ...achievement, isUnlocked, isRescuable: isUnlocked }
  }

  function isAchievementUnlocked(achievement: Achievement) {
    if (!user) return false

    switch (achievement.metric) {
      case 'unlocked_stars':
        return user.unlocked_stars >= achievement.required_amount - 1
      case 'acquired_rockets':
        return user.acquired_rockets >= achievement.required_amount
      case 'xp':
        return user.xp >= achievement.required_amount
      case 'completed_challenges':
        return user.completed_challenges >= achievement.required_amount
      case 'streak':
        return user.streak >= achievement.required_amount
      default:
        return false
    }
  }

  async function checkNewUnlockedAchivements(achievements: Achievement[]) {
    if (!achievements || !user) return

    const newUnlockedAchievements = achievements.filter(isAchievementUnlocked)

    if (newUnlockedAchievements) {
      setNewUnlockedAchievements(newUnlockedAchievements)

      // for (const { id } of newUnlockedAchievements) {
      //   await Promise.all([
      //     api.addUserUnlockedAchievement(id, user.id),
      //     api.addUserRescuableAchievements(id, user.id),
      //   ])
      // }

      const updatedAchievements = achievements.map((achievement) =>
        updateAchivement(achievement, newUnlockedAchievements)
      )

      setAchievements(updatedAchievements)
    }
  }

  useEffect(() => {
    if (data) {
      const achievements = data.map(addCurrentProgress)
      setAchievements(achievements)
      checkNewUnlockedAchivements(achievements)
    }
  }, [data])

  useEffect(() => {
    checkNewUnlockedAchivements(achievements)
  }, [user])

  return (
    <AchivementsContext.Provider value={{ achievements }}>
      {children}
    </AchivementsContext.Provider>
  )
}
