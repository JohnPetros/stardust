import { useEffect, useState, type RefObject } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'
import { ROUTES } from '@/constants'

export function useBlockedContentAlertDialog(
  ref: RefObject<AlertDialogRef | null>,
  content: 'comments' | 'solutions' | 'solution',
) {
  const [isVerifyingVisibility, setIsVerifyingVisibility] = useState(true)
  const { getChallengeSlice, getCraftsVisibilitySlice } = useChallengeStore()
  const { craftsVislibility } = getCraftsVisibilitySlice()
  const { challenge } = getChallengeSlice()
  const { goTo } = useNavigationProvider()

  function handleOpenChange(isOpen: boolean) {
    if (challenge && !isOpen)
      goTo(ROUTES.challenging.challenges.challenge(challenge.slug.value))
  }

  useEffect(() => {
    console.log('craftsVislibility', craftsVislibility)
    if (!challenge || !craftsVislibility) return
    let canShowContent = false

    console.log('craftsVislibility', craftsVislibility)

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
  }, [content, challenge, craftsVislibility, ref.current?.open])

  return {
    challengeSlug: challenge?.slug.value ?? '',
    isVerifyingVisibility,
    handleOpenChange,
  }
}
