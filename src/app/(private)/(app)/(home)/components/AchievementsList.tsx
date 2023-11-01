'use client'

import { ChangeEventHandler, useEffect, useState } from 'react'
import { twMerge } from 'tailwind-merge'

import { Achievement } from './Achievement'

import type { Achievement as AchievementData } from '@/@types/achievement'
import { Loading } from '@/app/components/Loading'
import { Search } from '@/app/components/Search'
import { useAchivements } from '@/contexts/AchievementsContext'
import { useAuth } from '@/contexts/AuthContext'
import { filterItemBySearch } from '@/utils/helpers'

export function AchievementsList() {
  const { user } = useAuth()
  const { achievements: data } = useAchivements()
  const [isLoading, setIsloading] = useState(!!data)
  const [achievements, setAchievements] = useState<AchievementData[]>([])
  const [search, setSearch] = useState('')

  function filterAchievementsBySearch(search: string) {
    if (data?.length)
      setAchievements(() =>
        data.filter((achievement) =>
          filterItemBySearch(search, achievement.name)
        )
      )
  }

  function handleSearchChange(search: string) {
    setSearch(search)
    filterAchievementsBySearch(search.trim())
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (data?.length && isLoading) {
      timer = setTimeout(() => {
        setAchievements(data)
        setIsloading(false)
      }, 1000)
    }

    return () => clearTimeout(timer)
  }, [data, isLoading])

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
            <Search
              value={search}
              onChange={({ target }) => handleSearchChange(target.value)}
            />
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
