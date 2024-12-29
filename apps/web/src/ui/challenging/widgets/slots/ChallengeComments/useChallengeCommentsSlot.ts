'use client'

import { useEffect } from 'react'

import { ROUTES } from '@/constants'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { useBreakpoint, useRouter } from '@/ui/global/hooks'

export function useChallengeCommentsSlot() {
  const { getChallengeSlice, getCraftsVisibilitySlice } = useChallengeStore()
  const { challenge } = getChallengeSlice()
  const { craftsVislibility } = getCraftsVisibilitySlice()
  const { goTo } = useRouter()
  const { md: isMobile } = useBreakpoint()

  useEffect(() => {
    if (craftsVislibility.canShowComments.isFalse)
      goTo(`${ROUTES.challenging.challenge}/${challenge?.slug}`)
  }, [goTo, craftsVislibility, challenge?.slug])

  return {
    isMobile,
  }
}
