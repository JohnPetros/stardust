'use client'

import { useAchievementsContext } from '@/modules/app/contexts/AchievementsContext'

export function useAchievementCard(id: string, reward: number) {
  const { rescueAchivement } = useAchievementsContext()

  async function handleRescueButtonClick() {
    await rescueAchivement(id, reward)
  }

  return { handleRescueButtonClick }
}
