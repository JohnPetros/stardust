import { useState } from 'react'

import { ROUTES } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import type { ChallengingService } from '@stardust/core/challenging/interfaces'
import type { ActionResponse } from '@stardust/core/global/responses'

type OnUpdateChallengeVisibility = (
  challengeId: string,
  isPublic: boolean,
) => Promise<ActionResponse<{ isPublic: boolean }>>

export function useChallengeControl(
  challengingService: ChallengingService,
  onUpdateChallengeVisibility: OnUpdateChallengeVisibility,
  isChallengePublic: boolean,
  isManagingAsAdmin: boolean,
) {
  const router = useNavigationProvider()
  const toast = useToastContext()
  const { getChallengeSlice } = useChallengeStore()
  const { challenge, setChallenge } = getChallengeSlice()
  const [isPublic, setIsPublic] = useState(isChallengePublic)

  async function handleIsChallengePublicSwitchChange(isPublic: boolean) {
    if (!challenge) return

    challenge.isPublic = isPublic
    setIsPublic(isPublic)

    const response = await onUpdateChallengeVisibility(challenge.id.value, isPublic)

    if (response.isFailure) {
      challenge.isPublic = !isPublic
      setIsPublic(!isPublic)
      toast.show(response.errorMessage)
    }

    if (response.isSuccessful) {
      setChallenge(challenge)
    }
  }

  async function handleDeleteChallengeButtonClick() {
    if (!challenge) return

    const response = await challengingService.deleteChallenge(challenge)
    if (response.isFailure) {
      toast.show(response.errorMessage)
      return
    }

    router.goTo(ROUTES.challenging.challenges.list)
  }

  return {
    challenge,
    isPublic,
    isManagingAsAdminContext: isManagingAsAdmin,
    handleIsChallengePublicSwitchChange,
    handleDeleteChallengeButtonClick,
  }
}
