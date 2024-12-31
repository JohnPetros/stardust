'use client'

import { useEffect } from 'react'

import type { ChallengeVote } from '@stardust/core/challenging/types'
import { Challenge } from '@stardust/core/challenging/entities'

import { ROUTES } from '@/constants'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useChallengeStore } from '@/ui/challenging/stores/ChallengeStore'
import type { PanelsLayout } from '@/ui/challenging/stores/ChallengeStore/types'
import type { ChallengeDto } from '@stardust/core/challenging/dtos'
import { ChallengeCraftsVisibility } from '@stardust/core/challenging/structs'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

export function useChallengePage(challengeDto: ChallengeDto, userVote: ChallengeVote) {
  const {
    getChallengeSlice,
    getCraftsVisibilitySlice,
    getPanelsLayoutSlice,
    getVoteSlice,
  } = useChallengeStore()
  const { challenge, setChallenge } = getChallengeSlice()
  const { panelsLayout, setPanelsLayout } = getPanelsLayoutSlice()
  const { craftsVislibility, setCraftsVislibility } = getCraftsVisibilitySlice()
  const { vote, setVote } = getVoteSlice()
  const { user } = useAuthContext()
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
    if (!craftsVislibility && challenge && user) {
      const isChallengeCompleted = user.hasCompletedChallenge(challenge.id)
      setCraftsVislibility(
        ChallengeCraftsVisibility.create({
          canShowComments: isChallengeCompleted.isTrue,
          canShowSolutions: isChallengeCompleted.isTrue,
        }),
      )
    }
    if (!vote) setVote(userVote)
  }, [
    challenge,
    craftsVislibility,
    vote,
    user,
    challengeDto,
    userVote,
    setChallenge,
    setCraftsVislibility,
    setVote,
  ])

  return {
    panelsLayout,
    handleBackButton,
    handlePanelsLayoutButton,
  }
}
