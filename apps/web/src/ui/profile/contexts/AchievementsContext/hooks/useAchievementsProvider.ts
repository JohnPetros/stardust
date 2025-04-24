'use client'

import { type RefObject, useEffect, useState } from 'react'

import { Achievement } from '@stardust/core/profile/entities'
import { User } from '@stardust/core/global/entities'

import { useApi } from '@/ui/global/hooks/useApi'
import { useEventListener } from '@/ui/global/hooks/useEventListener'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

import { useObserveNewUnlockedAchievementsAction } from './useObserveNewUnlockedAchievementsAction'
import { DOM_EVENTS } from '@/constants'
import { Id, Integer } from '@stardust/core/global/structures'

export function useAchivementsProvider(
  newUnlockedAchievementsAlertDialogRef: RefObject<AlertDialogRef>,
) {
  const api = useApi()
  const toast = useToastContext()
  const { user, updateUser, notifyUserChanges } = useAuthContext()
  const { observe } = useObserveNewUnlockedAchievementsAction(() =>
    toast.show('Error ao observar novas conquistas desbloqueadas'),
  )
  const [newUnlockedAchievements, setNewUnlockedAchievements] = useState<Achievement[]>(
    [],
  )

  async function rescueAchivement(
    rescuableAchievementId: string,
    rescuableAchievementReward: number,
  ) {
    if (!user) return

    const response = await api.deleteRescuableAchievement(
      rescuableAchievementId,
      user.id.value,
    )

    if (response.isFailure) {
      toast.show(response.errorMessage, {
        type: 'error',
        seconds: 8,
      })

      return
    }

    user.rescueAchievement(
      Id.create(rescuableAchievementId),
      Integer.create(rescuableAchievementReward),
    )

    await updateUser(user)
  }

  function handleNewUnlockedAchievementsAlertDialogClose(isOpen: boolean) {
    if (!isOpen) {
      newUnlockedAchievementsAlertDialogRef.current?.close()
    }
  }

  async function observeNewUnlockedAchievements() {
    const { updatedUserDto, newUnlockedAchievementsDto } = await observe()

    if (!updatedUserDto || !newUnlockedAchievementsDto?.length) return

    setNewUnlockedAchievements(newUnlockedAchievementsDto.map(Achievement.create))
    newUnlockedAchievementsAlertDialogRef.current?.open()
    await updateUser(User.create(updatedUserDto))
  }

  // @ts-ignore
  useEventListener(DOM_EVENTS.userChange, observeNewUnlockedAchievements)

  return {
    newUnlockedAchievements,
    newUnlockedAchievementsAlertDialogRef,
    rescueAchivement,
    handleNewUnlockedAchievementsAlertDialogClose,
  }
}
