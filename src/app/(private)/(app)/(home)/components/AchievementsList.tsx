'use client'

import { useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { Achievement } from './Achievement'

import { Loading } from '@/app/components/Loading'
import { useAchivements } from '@/contexts/AchievementsContext'
import { useAuth } from '@/contexts/AuthContext'

export function AchievementsList() {
  const { user } = useAuth()
  const { achievements } = useAchivements()
  const [isLoading, setIsloading] = useState(!!achievements)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (achievements?.length && isLoading) {
      timer = setTimeout(() => {
        setIsloading(false)
      }, 1000)
    }

    return () => clearTimeout(timer)
  }, [achievements, isLoading])

  if (user)
    return (
      <div
        className={twMerge(
          'flex flex-shrink-0 flex-col gap-6 p-6',
          isLoading ? 'h-full items-center justify-center' : 'pb-32'
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
