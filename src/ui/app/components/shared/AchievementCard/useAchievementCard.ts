'use client'

import { useAchievementsContext } from '@/ui/app/contexts/AchievementsContext'

export function useAchievementCard(id: string, reward: number) {
  const { rescueAchivement } = useAchievementsContext()

  async function handleRescueButtonClick() {
    await rescueAchivement(id, reward)
  }

  return { handleRescueButtonClick }
}
