'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useChallenge } from '@/hooks/useChallenge'
import { useAuth } from '@/hooks/useAuth'
import { useChallengeContext } from '@/hooks/useChallengeContext'

import { Header } from './components/Header'
import { Slider } from './components/Slider'

export default function Challenge() {
  const { challengeId } = useParams()
  const { user } = useAuth()

  const { challenge } = useChallenge({
    challengeId: String(challengeId),
    userId: user?.id,
  })

  const { state, dispatch } = useChallengeContext()

  useEffect(() => {
    if (challenge) {
      dispatch({ type: 'setChallenge', payload: challenge })
    }
  }, [challenge])

  return (
    <div className="h-full">
      <Header />
      <main className="h-full">
        <Slider /> 
      </main>
    </div>
  )
}
