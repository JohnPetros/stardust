'use client'

import { useEffect } from 'react'

import { Challenge } from '@/@core/domain/entities'
import type { ChallengeDTO } from '@/@core/dtos'

import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import { ROUTES } from '@/ui/global/constants'
import { useRouter } from '@/ui/global/hooks'
import type { PanelsLayout } from '@/ui/challenging/stores/ChallengeStore/types'

export function useChallengePage(challengeDTO: ChallengeDTO) {
  const { getChallengeSlice, getPanelsLayoutSlice } = useChallengeStore()
  const { challenge, setChallenge } = getChallengeSlice()
  const { panelsLayout, setPanelsLayout } = getPanelsLayoutSlice()
  const router = useRouter()

  function handleBackButton() {
    if (!challenge) return

    const homeRoute = challenge.isFromStar.isTrue ? 'space' : 'challenges'
    router.goTo(ROUTES.private.app.home[homeRoute])
  }

  function handlePanelsLayoutButton(panelsLayout: PanelsLayout) {
    setPanelsLayout(panelsLayout)
  }

  useEffect(() => {
    if (!challenge && challenge) setChallenge(Challenge.create(challengeDTO))
  }, [challenge, challengeDTO, setChallenge])

  return {
    challenge,
    panelsLayout,
    handleBackButton,
    handlePanelsLayoutButton,
  }
}
