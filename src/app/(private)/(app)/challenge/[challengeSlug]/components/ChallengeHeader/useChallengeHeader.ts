'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Challenge } from '@/@types/Challenge'
import type { Vote } from '@/@types/Vote'
import { ROUTES } from '@/global/constants'
import { useChallengeStore } from '@/stores/challengeStore'
import { PanelsLayout } from '@/stores/challengeStore/types/PanelsLayout'

export function useChallengeHeader(challenge: Challenge, userVote: Vote) {
  const { state, actions } = useChallengeStore((store) => store)

  const router = useRouter()

  function handleBackButton() {
    router.push(ROUTES.private.home[challenge.starId ? 'space' : 'challenges'])
  }

  function handlePanelsLayoutButton(panelsLayout: PanelsLayout) {
    actions.setPanelsLayout(panelsLayout)
  }

  useEffect(() => {
    if (!state.challenge && challenge) actions.setChallenge(challenge)
    if (!state.userVote && userVote) actions.setUserVote(userVote)
  }, [challenge, userVote, state, actions])

  return {
    panelsLayout: state.panelsLayout,
    handleBackButton,
    handlePanelsLayoutButton,
  }
}
