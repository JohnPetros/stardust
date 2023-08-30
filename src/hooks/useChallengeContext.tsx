'use client'

import { useContext } from 'react'
import { ChallengeContext } from '@/contexts/ChallengeContext'

export function useChallengeContext() {
  const context = useContext(ChallengeContext)

  if (!context) {
    throw new Error('useChallengeContext must be used inside ChallengeContext')
  }

  return context
}
