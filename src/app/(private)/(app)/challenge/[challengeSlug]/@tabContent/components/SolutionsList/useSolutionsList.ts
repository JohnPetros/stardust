'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { useChallengeStore } from '@/stores/challengeStore'
import { ROUTES } from '@/utils/constants'

export function useSolutionsList(canShowSolutions: boolean) {
  const challenge = useChallengeStore((store) => store.state.challenge)
  const router = useRouter()

  useEffect(() => {
    if (!canShowSolutions)
      router.push(`${ROUTES.private.challenge}/${challenge?.slug}`)
  }, [canShowSolutions, router, challenge?.slug])

  return {}
}
