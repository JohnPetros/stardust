'use client'

import { useAchievement } from '@/hooks/useAchievement'
import { Achievement } from './Achievement'
import { useAuth } from '@/hooks/useAuth'

export function AchievementsList() {
  const { user } = useAuth()

  const { achievements } = useAchievement(user?.id)

  if (user)
  return (
    <div className="flex flex-col gap-6">
      {achievements?.map((achievement) => (
        <Achievement
          key={achievement.id}
          data={achievement}
          currentProgress={50}
          // currentProgress={user[achievement.metric]}
        />
      ))}
    </div>
  )
}
