'use client'

import { useEffect, useState } from 'react'

type Sorter = 'Ordem padrão' | 'Desbloqueadas' | 'Bloqueadas'

import type { Achievement as AchievementItem } from '@/@types/Achievement'
import { useAchivementsContext } from '@/contexts/AchievementsContext/hooks/useAchivementsContext'
import { PopoverMenuButton } from '@/global/components/PopoverMenu'
import { filterItemBySearch } from '@/global/helpers'

export function useAchievementsList() {
  const { achievements: data } = useAchivementsContext()
  const [isLoading, setIsloading] = useState(false)
  const [achievements, setAchievements] = useState<AchievementItem[]>([])
  const [sorter, setSorter] = useState<Sorter>('Ordem padrão')

  function sortedAchievementsByLocking(a: AchievementItem, b: AchievementItem) {
    if (!a.isUnlocked && b.isUnlocked) {
      return -1
    }

    if (a.isUnlocked && !b.isUnlocked) {
      return 1
    }

    return 0
  }

  function sortedAchievementsByUnlocking(
    a: AchievementItem,
    b: AchievementItem
  ) {
    if (a.isUnlocked && !b.isUnlocked) {
      return -1
    }

    if (!a.isUnlocked && b.isUnlocked) {
      return 1
    }

    return 0
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

  function filterAchievementsBySearch(search: string) {
    if (data?.length)
      setAchievements(() =>
        data.filter((achievement) =>
          filterItemBySearch(search, achievement.name)
        )
      )
  }

  function handleSearchChange(search: string) {
    filterAchievementsBySearch(search.trim())
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (data?.length && isLoading) {
      timer = setTimeout(() => {
        setIsloading(false)
      }, 5000)
    }

    if (data?.length) setAchievements(data)

    return () => clearTimeout(timer)
  }, [data, isLoading])

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

  return {
    popoverMenuButtons,
    isLoading,
    achievements,
    handleSearchChange,
  }
}
