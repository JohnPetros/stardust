'use client'

import { useEffect } from 'react'

import type { Challenge } from '@/@core/domain/entities'

import { useRouter } from '@/ui/global/hooks'
import { ROUTES } from '@/ui/global/constants'
import { useChallengeStore } from '@/ui/app/stores/ChallengeStore'
import type { PanelsLayout } from '@/ui/app/stores/ChallengeStore/types'

export function useChallengeHeader(challenge: Challenge) {
  const { getChallengeSlice, getPanelsLayoutSlice } = useChallengeStore()
  const { setChallenge } = getChallengeSlice()
  const { panelsLayout, setPanelsLayout } = getPanelsLayoutSlice()
  const router = useRouter()

  function handleBackButtonClick() {
    router.goTo(
      ROUTES.private.app.home[challenge.isFromStar.isTrue ? 'space' : 'challenges'],
    )
  }

  function handlePanelsLayoutButtonClick(panelsLayout: PanelsLayout) {
    setPanelsLayout(panelsLayout)
  }

  useEffect(() => {
    setChallenge(challenge)
    // if (!state.userVote && userVote) setUserVote(userVote)
  }, [challenge, setChallenge])

  return {
    panelsLayout,
    handleBackButtonClick,
    handlePanelsLayoutButtonClick,
  }
}
