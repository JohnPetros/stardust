'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Challenge } from '@/@types/challenge'
import { useChallengeStore } from '@/stores/challengeStore'

export function useHeader(challenge: Challenge) {
  const setChallenge = useChallengeStore((store) => store.actions.setChallenge)
  const router = useRouter()

  function handleBackButton() {
    router.back()
  }

  useEffect(() => {
    if (challenge) setChallenge(challenge)
  }, [challenge, setChallenge])

  return {
    handleBackButton,
  }
}
