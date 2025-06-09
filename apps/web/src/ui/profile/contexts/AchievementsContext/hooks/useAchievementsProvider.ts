import { type RefObject, useState } from 'react'

import { Achievement } from '@stardust/core/profile/entities'
import { Id } from '@stardust/core/global/structures'
import type { ProfileService } from '@stardust/core/profile/interfaces'

import { DOM_EVENTS } from '@/constants'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useEventListener } from '@/ui/global/hooks/useEventListener'

export function useAchivementsProvider(
  profileService: ProfileService,
  newUnlockedAchievementsAlertDialogRef: RefObject<AlertDialogRef>,
) {
  const toast = useToastContext()
  const { user, refetchUser } = useAuthContext()
  const [newUnlockedAchievements, setNewUnlockedAchievements] = useState<Achievement[]>(
    [],
  )

  async function rescueAchivement(rescuableAchievementId: string) {
    if (!user) return

    const response = await profileService.rescueAchievement(
      Id.create(rescuableAchievementId),
      user.id,
    )

    if (response.isFailure) {
      toast.showError(response.errorMessage, 8)
      return
    }

    refetchUser()
  }

  function handleNewUnlockedAchievementsAlertDialogClose(isOpen: boolean) {
    if (!isOpen) {
      newUnlockedAchievementsAlertDialogRef.current?.close()
    }
  }

  async function observeNewUnlockedAchievements() {
    if (!user) return

    const response = await profileService.observeNewUnlockedAchievements(user.id)
    if (response.isFailure) {
      toast.showError(response.errorMessage, 8)
      return
    }

    const newUnlockedAchievementsDto = response.body
    if (newUnlockedAchievementsDto.length) {
      setNewUnlockedAchievements(newUnlockedAchievementsDto.map(Achievement.create))
      newUnlockedAchievementsAlertDialogRef.current?.open()
      refetchUser()
    }
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
