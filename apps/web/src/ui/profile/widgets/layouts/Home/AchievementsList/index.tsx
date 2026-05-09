'use client'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { AchievementsListView } from './AchievementsListView'
import { useAchievementsList } from './useAchievementsList'

export function AchievementsList() {
  const { user } = useAuthContext()
  const { achievementsList, isLoading, popoverMenuButtons, handleSearchChange } =
    useAchievementsList()

  if (!user) return null

  const achievements =
    achievementsList?.achievements?.map((achievement) => ({
      id: achievement.id.value,
      name: achievement.name.value,
      description: achievement.description,
      icon: achievement.icon.value,
      reward: achievement.reward.value,
      metric: achievement.metric.value,
      requiredCount: achievement.requiredCount.value,
      isUnlocked: user.hasUnlockedAchievement(achievement.id).isTrue,
      isRescuable: user.hasRescuableAchievement(achievement.id).isTrue,
    })) ?? []

  return (
    <AchievementsListView
      isLoading={isLoading}
      achievements={achievements}
      popoverMenuButtons={popoverMenuButtons}
      onSearchChange={handleSearchChange}
    />
  )
}
