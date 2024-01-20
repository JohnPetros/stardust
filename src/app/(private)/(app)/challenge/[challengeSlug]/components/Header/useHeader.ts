'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { Challenge } from '@/@types/challenge'
import { useChallengeStore } from '@/stores/challengeStore'

export function useHeader(challenge: Challenge) {
  const setChallenge = useChallengeStore((store) => store.actions.setChallenge)
  const resetState = useChallengeStore((store) => store.actions.resetState)
  const router = useRouter()

  function handleBackButton() {
    router.back()
  }

  useEffect(() => {
    setChallenge(challenge)

    return resetState
  }, [challenge, setChallenge, resetState])

  return {
    handleBackButton,
  }
}
