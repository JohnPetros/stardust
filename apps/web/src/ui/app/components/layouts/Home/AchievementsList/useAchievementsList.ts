'use client'

import { useEffect, useState } from 'react'

import type { PopoverMenuButton } from '@/ui/global/components/shared/PopoverMenu'
import { useAuthContext } from '@/ui/global/contexts/AuthContext'
import { useAchievementsContext } from '@/ui/app/contexts/AchievementsContext'
import { AchievementsCollection } from '@/@core/domain/structs'

type Sorter = 'Ordem padrão' | 'Desbloqueadas' | 'Bloqueadas'

export function useAchievementsList() {
  const { achievementsDto } = useAchievementsContext()
  const { user } = useAuthContext()

  const [isLoading, setIsloading] = useState(false)
  const [sorter, setSorter] = useState<Sorter>('Ordem padrão')
  const [achievementsCollection, setAchievementsCollection] =
    useState<AchievementsCollection | null>(null)

  function orderAchievements(sorter: Sorter) {
    if (!achievementsCollection) return

    setSorter(sorter)

    let newAchievementsCollection: AchievementsCollection

    switch (sorter) {
      case 'Ordem padrão':
        newAchievementsCollection = achievementsCollection.orderAchievementsByPosition()
        break
      case 'Desbloqueadas':
        newAchievementsCollection =
          achievementsCollection.orderAchievementsByUnLockingState()
        break
      case 'Bloqueadas':
        newAchievementsCollection =
          achievementsCollection.orderAchievementsByLockingState()
        break
      default:
        return
    }

    setAchievementsCollection(newAchievementsCollection)
  }

  function handleSearchChange(search: string) {
    if (!search && user) {
      setAchievementsCollection(AchievementsCollection.create(achievementsDto, user.dto))
      return
    }

    if (achievementsCollection) {
      setAchievementsCollection(achievementsCollection.filterAchievementsByName(search))
    }
  }

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (achievementsDto?.length && isLoading) {
      timer = setTimeout(() => {
        setIsloading(false)
      }, 5000)
    }

    if (achievementsDto.length && user) {
      setAchievementsCollection(AchievementsCollection.create(achievementsDto, user.dto))
    }

    return () => clearTimeout(timer)
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
    achievementsCollection,
    handleSearchChange,
  }
}
