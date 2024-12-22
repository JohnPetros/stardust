'use client'

import { type RefObject, useEffect, useState } from 'react'

import type { AchievementDto } from '@stardust/core/profile/dtos'
import { Achievement } from '@stardust/core/profile/entities'
import { User } from '@stardust/core/global/entities'

import { useApi, useEventListener } from '@/ui/global/hooks'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

import type { _observeNewUnlockedAchievements } from '../actions/_observeNewUnlockedAchievements'

export function useAchivementsProvider(
  achievementsDto: AchievementDto[],
  newUnlockedAchievementsAlertDialogRef: RefObject<AlertDialogRef>,
  serverAction: typeof _observeNewUnlockedAchievements,
) {
  const { user, updateUser } = useAuthContext()
  const [newUnlockedAchievements, setNewUnlockedAchievements] = useState<Achievement[]>(
    [],
  )
  const api = useApi()
  const toast = useToastContext()

  async function rescueAchivement(
    rescuableAchievementId: string,
    rescuableAchievementReward: number,
  ) {
    if (!user) return

    const response = await api.deleteRescuableAchievement(rescuableAchievementId, user.id)

    if (response.isFailure) {
      toast.show(response.errorMessage, {
        type: 'error',
        seconds: 8,
      })

      return
    }

    user.rescueAchievement(rescuableAchievementId, rescuableAchievementReward)

    await updateUser(user)
  }

  function handleNewUnlockedAchievementsAlertDialogClose(isOpen: boolean) {
    if (!isOpen) {
      newUnlockedAchievementsAlertDialogRef.current?.close()
      setNewUnlockedAchievements([])
    }
  }

  async function observeNewUnlockedAchievements() {
    if (!user) return

    try {
      const response = await serverAction(achievementsDto, user.dto)

      if (!response.newUnlockedAchievementsDto.length) return

      setNewUnlockedAchievements(
        response.newUnlockedAchievementsDto.map(Achievement.create),
      )
      await updateUser(User.create(response.userDto))
    } catch (error) {
      toast.show('Error ao observar conquistas')
    }
  }

  useEffect(() => {
    if (newUnlockedAchievements.length) {
      newUnlockedAchievementsAlertDialogRef.current?.open()
    }
  }, [newUnlockedAchievements, newUnlockedAchievementsAlertDialogRef])

  // @ts-ignore
  useEventListener('userChange', observeNewUnlockedAchievements)

  return {
    newUnlockedAchievements,
    newUnlockedAchievementsAlertDialogRef,
    rescueAchivement,
    handleNewUnlockedAchievementsAlertDialogClose,
  }
}
