'use client'

import Lottie from 'lottie-react'

import Missing from '../../../../../../../public/animations/apollo-missing.json'
import { Achievement } from '../../components/Achievement'

import { useUserAchievements } from '@/global/hooks/useUserAchievements'

interface AchievementsProps {
  userId: string
}

export function Achievements({ userId }: AchievementsProps) {
  const { userAchievements } = useUserAchievements(userId)
  const unlockedAchievements = userAchievements?.filter(
    (achievement) => achievement.isUnlocked
  )

  if (unlockedAchievements?.length) {
    return (
      <div className='custom-scroll grid h-72 grid-cols-1 content-start gap-4 overflow-y-auto px-1 md:grid-cols-2'>
        {unlockedAchievements.map((achivement) => (
          <div key={achivement.id} className='h-24'>
            <Achievement data={achivement} isUnlocked={true} isRescuable={false} />
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className='flex flex-col items-center justify-center'>
      <Lottie animationData={Missing} loop={true} style={{ width: 220 }} />
      <p className='text-sm text-gray-300'>Nenhuma conquista adquirida ainda 😢.</p>
    </div>
  )
}
