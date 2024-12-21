'use client'

import { type RefObject, useEffect, useState } from 'react'

import type { AchievementDto } from '#dtos'
import { Achievement, User } from '@/@core/domain/entities'

import { useApi } from '@/infra/api'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types/AlertDialogRef'
import { useEventListener } from '@/ui/global/hooks/useEventListener'

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
      toast.show(error.message)
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
