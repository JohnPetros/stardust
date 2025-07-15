import { useEffect, useState, type RefObject } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { ROUTES } from '@/constants'

export function useBlockedContentAlertDialog(
  ref: RefObject<AlertDialogRef | null>,
  content: 'comments' | 'solutions' | 'solution',
) {
  const [isVerifyingVisibility, setIsVerifyingVisibility] = useState(true)
  const { getChallengeSlice, getCraftsVisibilitySlice } = useChallengeStore()
  const { craftsVislibility } = getCraftsVisibilitySlice()
  const { challenge } = getChallengeSlice()
  const { user } = useAuthContext()
  const { goTo } = useRouter()

  function handleOpenChange(isOpen: boolean) {
    if (challenge && !isOpen)
      goTo(ROUTES.challenging.challenges.challenge(challenge.slug.value))
  }

  useEffect(() => {
    if (!challenge || !user || !craftsVislibility) return
    let canShowContent = false

    switch (content) {
      case 'comments':
        canShowContent = craftsVislibility.canShowComments.isTrue
        break
      case 'solutions':
      case 'solution':
        canShowContent = craftsVislibility.canShowSolutions.isTrue
        break
    }

    if (!canShowContent) {
      ref.current?.open()
      return
    }
    setIsVerifyingVisibility(false)
  }, [content, user, challenge, craftsVislibility, ref.current?.open])

  return {
    challengeSlug: challenge?.slug.value ?? '',
    isVerifyingVisibility,
    handleOpenChange,
  }
}
