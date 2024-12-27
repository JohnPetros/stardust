'use client'

import { useEffect } from 'react'

import type { ChallengeVote } from '@stardust/core/challenging/types'
import { Challenge } from '@stardust/core/challenging/entities'

import { ROUTES } from '@/constants'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import type { PanelsLayout } from '@/ui/challenging/stores/ChallengeStore/types'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'

export function useChallengePage(challengeDto: ChallengeDto, userVote: ChallengeVote) {
  const { getChallengeSlice, getPanelsLayoutSlice, getVoteSlice } = useChallengeStore()
  const { challenge, setChallenge } = getChallengeSlice()
  const { panelsLayout, setPanelsLayout } = getPanelsLayoutSlice()
  const { vote, setVote } = getVoteSlice()
  const router = useRouter()

  function handleBackButton() {
    if (challenge)
      router.goTo(
        challenge.isFromStar.isTrue ? ROUTES.space : ROUTES.challenging.challenges,
      )
  }

  function handlePanelsLayoutButton(panelsLayout: PanelsLayout) {
    setPanelsLayout(panelsLayout)
  }

  useEffect(() => {
    if (!challenge) setChallenge(Challenge.create(challengeDto))
    if (!vote && userVote) setVote(userVote)
  }, [challenge, vote, challengeDto, userVote, setChallenge, setVote])

  return {
    panelsLayout,
    handleBackButton,
    handlePanelsLayoutButton,
  }
}
