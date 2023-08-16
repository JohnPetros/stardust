'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useAchievement } from '@/hooks/useAchievement'

import { Loading } from '@/app/components/Loading'
import { Achievement } from './Achievement'
import { twMerge } from 'tailwind-merge'

export function AchievementsList() {
  const { user } = useAuth()

  const { achievements } = useAchievement(user?.id)
  const [isLoading, setIsloading] = useState(!!achievements)

  useEffect(() => {
    if (achievements?.length && isLoading) {
      setTimeout(() => {
        setIsloading(false)
      }, 1500)
    }
  }, [achievements])

  if (user)
    return (
      <div
        className={twMerge(
          'flex flex-col gap-6 p-6 flex-shrink-0',
          isLoading && 'items-center justify-center h-full'
        )}
      >
        {!isLoading ? (
          <>
            {achievements?.map((achievement) => (
              <Achievement
                key={achievement.id}
                data={achievement}
                currentProgress={50}
                // currentProgress={user[achievement.metric]}
              />
            ))}
          </>
        ) : (
          <Loading />
        )}
      </div>
    )
}
