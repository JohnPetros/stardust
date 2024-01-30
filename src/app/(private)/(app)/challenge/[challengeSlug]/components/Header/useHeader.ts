'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Challenge } from '@/@types/challenge'
import type { Vote } from '@/@types/vote'
import { type Layout, useChallengeStore } from '@/stores/challengeStore'
import { ROUTES } from '@/utils/constants'

export function useHeader(challenge: Challenge, userVote: Vote) {
  const { state, actions } = useChallengeStore((store) => store)

  const router = useRouter()

  function handleBackButton() {
    router.push(ROUTES.private.home[challenge.star_id ? 'space' : 'challenges'])
  }

  function handleLayoutButton(layout: Layout) {
    actions.setLayout(layout)
  }

  useEffect(() => {
    if (!state.challenge && challenge) actions.setChallenge(challenge)
    if (!state.userVote && userVote) actions.setUserVote(userVote)
  }, [challenge, userVote, state, actions])

  return {
    layout: state.layout,
    handleBackButton,
    handleLayoutButton,
  }
}
