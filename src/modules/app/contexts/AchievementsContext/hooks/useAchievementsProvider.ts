'use client'

import { type RefObject, useEffect, useState } from 'react'

import type { AchievementDTO } from '@/@core/dtos'
import type { Achievement } from '@/@core/domain/entities/Achievement'

import { useApi } from '@/infra/api'
import { useToastContext } from '@/modules/global/contexts/ToastContext'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'
import type { AlertDialogRef } from '@/modules/global/components/shared/AlertDialog/types/AlertDialogRef'
import { useEventListener } from '@/modules/global/hooks/useEventListener'

import type { _observeNewUnlockedAchievements } from '../actions/_observeNewUnlockedAchievements'

export function useAchivementsProvider(
  achievementsDTO: AchievementDTO[],
  newUnlockedAchievementsAlertDialogRef: RefObject<AlertDialogRef>,
  serverAction: typeof _observeNewUnlockedAchievements
) {
  const { user, updateUser } = useAuthContext()
  const [newUnlockedAchievements, setNewUnlockedAchievements] = useState<Achievement[]>(
    []
  )

  const api = useApi()
  const toast = useToastContext()

  async function rescueAchivement(
    rescuableAchievementId: string,
    rescuableAchievementReward: number
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
      const response = await serverAction(achievementsDTO, user.dto)
      setNewUnlockedAchievements(response.newUnlockedAchievements)
      updateUser(response.user)
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
