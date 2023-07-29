'use client'

import { useAchievement } from '@/hooks/useAchievement'
import { Achievement } from '../../components/Achievement'
import Lottie from 'lottie-react'
import Missing from '../../../../../../../public/animations/apollo-missing.json'

interface AchievementsProps {
  userId: string
}

export function Achievements({ userId }: AchievementsProps) {
  const { achievements } = useAchievement(userId)
  const unlockedAchievements = achievements?.filter(
    (achievement) => achievement.isUnlocked
  )

  if (unlockedAchievements?.length) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {unlockedAchievements.map((achivement) => (
          <Achievement key={achivement.id} data={achivement}></Achievement>
        ))}
      </div>
    )
  } else {
    return (
      <div className="flex flex-col items-center justify-center">
        <Lottie animationData={Missing} loop={true} style={{ width: 220 }} />
        <p className="text-gray-300 text-sm">Nenhuma conquista adquirida ainda 😢.</p>
      </div>
    )
  }
}
