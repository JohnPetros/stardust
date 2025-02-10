import { useEffect, useState, type RefObject } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { ROUTES } from '@/constants'

export function useBlockedContentAlertDialog(ref: RefObject<AlertDialogRef>) {
  const [isVerifyingVisibility, setIsVerifyingVisibility] = useState(true)
  const { user } = useAuthContext()
  const { getChallengeSlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()
  const { goTo } = useRouter()

  function handleOpenChange(isOpen: boolean) {
    if (challenge && !isOpen)
      goTo(ROUTES.challenging.challenges.challenge(challenge.slug.value))
  }

  useEffect(() => {
    if (!challenge || !user) return

    const isChallengeCompleted = user.hasCompletedChallenge(challenge.id)
    if (isChallengeCompleted.isFalse) {
      ref.current?.open()
      return
    }
    setIsVerifyingVisibility(false)
  }, [challenge, user, ref.current?.open])

  return {
    challengeSlug: challenge?.slug.value ?? '',
    isVerifyingVisibility,
    handleOpenChange,
  }
}
