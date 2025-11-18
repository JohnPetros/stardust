'use client'

import { useRef } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'

import { useChallengeResultSlot } from './useChallengeResultSlot'
import { ChallengeResultSlotView } from './ChallengeResultSlotView'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'

export const ChallengeResultSlot = () => {
  const alertDialogRef = useRef<AlertDialogRef | null>(null)
  const { isAccountAuthenticated } = useAuthContext()
  const { challenge, results, userAnswer, isLeavingPage, handleUserAnswer } =
    useChallengeResultSlot({ alertDialogRef, isAccountAuthenticated })

  if (challenge)
    return (
      <ChallengeResultSlotView
        alertDialogRef={alertDialogRef}
        challenge={challenge}
        results={results}
        userAnswer={userAnswer}
        isLeavingPage={isLeavingPage}
        handleUserAnswer={handleUserAnswer}
      />
    )
}
