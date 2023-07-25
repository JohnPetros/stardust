'use client'

import { useAchievement } from '@/hooks/useAchievements'
import { Achievement } from './Achievement'
import { useAuth } from '@/hooks/useAuth'

export function AchievementsList() {
  const { user } = useAuth()
  if (!user) return null

  const { achievements } = useAchievement(user.id)

  return (
    <div className="flex flex-col gap-6 overflow-y-scroll">
      {achievements?.map((achievement) => (
        <Achievement
          key={achievement.id}
          data={achievement}
          currentProgress={user[achievement.metric]}
        />
      ))}
    </div>
  )
}
