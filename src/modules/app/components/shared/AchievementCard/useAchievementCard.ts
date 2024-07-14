'use client'

import { useAchievementsContext } from '@/modules/app/contexts/AchievementsContext'

export function useAchievementCard(id: string, reward: number) {
  const { rescueAchivement } = useAchievementsContext()

  async function handleRescuButtonClick() {
    await rescueAchivement(id, reward)
  }

  return { handleRescuButtonClick }
}
