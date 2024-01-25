'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Challenge } from '@/@types/challenge'
import type { Vote } from '@/@types/vote'
import { useChallengeStore } from '@/stores/challengeStore'
import { ROUTES } from '@/utils/constants'

export function useHeader(challenge: Challenge, userVote: Vote) {
  const setChallenge = useChallengeStore((store) => store.actions.setChallenge)
  const setUserVote = useChallengeStore((store) => store.actions.setUserVote)
  const router = useRouter()

  function handleBackButton() {
    router.push(ROUTES.private.home.space)
  }

  useEffect(() => {
    if (challenge) setChallenge(challenge)
    if (userVote) setUserVote(userVote)
  }, [challenge, userVote, setChallenge, setUserVote])

  return {
    handleBackButton,
  }
}
