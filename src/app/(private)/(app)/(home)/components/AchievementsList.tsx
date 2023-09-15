'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

import { Loading } from '@/app/components/Loading'
import { Achievement } from './Achievement'
import { twMerge } from 'tailwind-merge'
import { useAchivementsContext } from '@/hooks/useAchievementContext'

export function AchievementsList() {
  const { user } = useAuth()
  const { achievements } = useAchivementsContext()
  const [isLoading, setIsloading] = useState(!!achievements)

  useEffect(() => {
    if (achievements?.length && isLoading) {
      setTimeout(() => {
        setIsloading(false)
      }, 1000)
    }
  }, [achievements])

  if (user)
    return (
      <div
        className={twMerge(
          'flex flex-col gap-6 p-6 flex-shrink-0',
          isLoading ? 'items-center justify-center h-full' : 'pb-32'
        )}
      >
        {!isLoading ? (
          <>
            {achievements?.map((achievement) => (
              <Achievement
                key={achievement.id}
                data={achievement}
                isUnlocked={achievement.isUnlocked}
                isRescuable={achievement.isRescuable}
              />
            ))}
          </>
        ) : (
          <Loading />
        )}
      </div>
    )
}
