'use client'

import { useEffect, useState } from 'react'
import { ArrowsDownUp } from '@phosphor-icons/react'
import { twMerge } from 'tailwind-merge'

import { Achievement } from './Achievement'

import type { Achievement as AchievementItem } from '@/@types/achievement'
import { Loading } from '@/app/components/Loading'
import { PopoverMenu, PopoverMenuButton } from '@/app/components/PopoverMenu'
import { Search } from '@/app/components/Search'
import { useAchivements } from '@/contexts/AchievementsContext'
import { useAuth } from '@/contexts/AuthContext'
import { filterItemBySearch } from '@/utils/helpers'

type Sorter = 'Ordem padrão' | 'Desbloqueadas' | 'Bloqueadas'

export function AchievementsList() {
  const { user } = useAuth()
  const { achievements: data } = useAchivements()
  const [isLoading, setIsloading] = useState(!!data)
  const [achievements, setAchievements] = useState<AchievementItem[]>([])
  const [search, setSearch] = useState('')
  const [sorter, setSorter] = useState<Sorter>('Ordem padrão')

  function sortedAchievementsByLocking(a: AchievementItem, b: AchievementItem) {
    if (!a.isUnlocked && b.isUnlocked) {
      return -1 // b vem antes de a
    } else if (a.isUnlocked && !b.isUnlocked) {
      return 1 // b vem depois de a
    } else {
      return 0 // a e b são iguais em relação à isUnlocked
    }
  }

  function sortedAchievementsByUnlocking(
    a: AchievementItem,
    b: AchievementItem
  ) {
    if (a.isUnlocked && !b.isUnlocked) {
      return -1 // a vem antes de b
    } else if (!a.isUnlocked && b.isUnlocked) {
      return 1 // a vem depois de b
    } else {
      return 0 // a e b são iguais em relação à isUnlocked
    }
  }

  function sortedAchievementsByPosition(
    a: AchievementItem,
    b: AchievementItem
  ) {
    return a.position - b.position
  }

  function sortAchievements(sorter: Sorter) {
    setSorter(sorter)

    let sortedAchievements: AchievementItem[] = []
    switch (sorter) {
      case 'Ordem padrão':
        sortedAchievements = [...achievements].sort(
          sortedAchievementsByPosition
        )
        break
      case 'Desbloqueadas':
        sortedAchievements = [...achievements].sort(
          sortedAchievementsByUnlocking
        )
        break
      case 'Bloqueadas':
        sortedAchievements = [...achievements].sort(sortedAchievementsByLocking)
        break
      default:
        return
    }
    setAchievements(sortedAchievements)
  }

  const popoverMenuButtons: PopoverMenuButton[] = [
    {
      title: 'Ordem padrão',
      isToggle: true,
      value: sorter === 'Ordem padrão',
      action: () => sortAchievements('Ordem padrão'),
    },
    {
      title: 'Desbloqueadas',
      isToggle: true,
      value: sorter === 'Desbloqueadas',
      action: () => sortAchievements('Desbloqueadas'),
    },
    {
      title: 'Bloqueadas',
      isToggle: true,
      value: sorter === 'Bloqueadas',
      action: () => sortAchievements('Bloqueadas'),
    },
  ]

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
              name="search-achivements"
              onChange={({ target }) => handleSearchChange(target.value)}
            />
            <div className="ml-auto w-max">
              <PopoverMenu
                label="Abrir menu para ordernar lista de conquistas"
                buttons={popoverMenuButtons}
                trigger={<ArrowsDownUp className="text-lg text-gray-500" />}
              />
            </div>
            <div className="-mt-8">
              {achievements?.map((achievement) => (
                <Achievement
                  key={achievement.id}
                  data={achievement}
                  isUnlocked={achievement.isUnlocked}
                  isRescuable={achievement.isRescuable}
                />
              ))}
            </div>
          </>
        ) : (
          <Loading />
        )}
      </div>
    )
}
