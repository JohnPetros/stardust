'use client'

import { useEffect, useState } from 'react'

import type { PopoverMenuButton } from '@/ui/global/widgets/components/PopoverMenu/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useAchievementsContext } from '@/ui/profile/contexts/AchievementsContext'
import { AchievementsList as AchievementsListStruct } from '@stardust/core/profile/structures'

type Sorter = 'Ordem padrão' | 'Desbloqueadas' | 'Bloqueadas'

export function useAchievementsList() {
  const { achievementsDto } = useAchievementsContext()
  const { user } = useAuthContext()

  const [isLoading, setIsloading] = useState(false)
  const [sorter, setSorter] = useState<Sorter>('Ordem padrão')
  const [achievementsList, setAchievementsList] = useState<AchievementsListStruct | null>(
    null,
  )

  function orderAchievements(sorter: Sorter) {
    if (!achievementsList) return

    setSorter(sorter)

    let newAchievementsList: AchievementsListStruct

    switch (sorter) {
      case 'Ordem padrão':
        newAchievementsList = achievementsList.orderAchievementsByPosition()
        break
      case 'Desbloqueadas':
        newAchievementsList = achievementsList.orderAchievementsByUnLockingState()
        break
      case 'Bloqueadas':
        newAchievementsList = achievementsList.orderAchievementsByLockingState()
        break
      default:
        return
    }

    setAchievementsList(newAchievementsList)
  }

  function handleSearchChange(search: string) {
    if (!search && user) {
      setAchievementsList(AchievementsListStruct.create(achievementsDto, user.dto))
      return
    }

    if (achievementsList) {
      setAchievementsList(achievementsList.filterAchievementsByName(search))
    }
  }

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (achievementsDto?.length && isLoading) {
      timeout = setTimeout(() => {
        setIsloading(false)
      }, 5000)
    }

    if (achievementsDto.length && user) {
      setAchievementsList(AchievementsListStruct.create(achievementsDto, user.dto))
    }

    return () => clearTimeout(timeout)
  }, [achievementsDto, user, isLoading])

  const popoverMenuButtons: PopoverMenuButton[] = [
    {
      title: 'Ordem padrão',
      isToggle: true,
      value: sorter === 'Ordem padrão',
      action: () => orderAchievements('Ordem padrão'),
    },
    {
      title: 'Desbloqueadas',
      isToggle: true,
      value: sorter === 'Desbloqueadas',
      action: () => orderAchievements('Desbloqueadas'),
    },
    {
      title: 'Bloqueadas',
      isToggle: true,
      value: sorter === 'Bloqueadas',
      action: () => orderAchievements('Bloqueadas'),
    },
  ]

  return {
    popoverMenuButtons,
    isLoading,
    achievementsList,
    handleSearchChange,
  }
}
