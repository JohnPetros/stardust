import { useState } from 'react'

import { ROUTES } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useApi } from '@/ui/global/hooks/useApi'
import { useRouter } from '@/ui/global/hooks/useRouter'

export function useChallengeControl(isChallengePublic: boolean) {
  const api = useApi()
  const router = useRouter()
  const toast = useToastContext()
  const { getChallengeSlice } = useChallengeStore()
  const { challenge, setChallenge } = getChallengeSlice()
  const [isPublic, setIsPublic] = useState(isChallengePublic)

  async function handleIsChallengePublicSwitchChange(isPublic: boolean) {
    if (!challenge) return

    challenge.isPublic = isPublic
    setIsPublic(isPublic)

    const response = await api.updateChallenge(challenge)

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

    const response = await api.deleteChallenge(challenge.id)
    if (response.isFailure) {
      toast.show(response.errorMessage)
      return
    }

    router.goTo(ROUTES.challenging.challenges.list)
  }

  return {
    challenge,
    isPublic,
    handleIsChallengePublicSwitchChange,
    handleDeleteChallengeButtonClick,
  }
}
