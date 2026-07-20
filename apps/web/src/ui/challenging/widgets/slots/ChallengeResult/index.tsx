'use client'

import { useRef } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'

import { useChallengeResultSlot } from './useChallengeResultSlot'
import { ChallengeResultSlotView } from './ChallengeResultSlotView'
import { useAuthContext } from '@/ui/global/hooks/useAuthContext'
import { useRestContext } from '@/ui/global/hooks/useRestContext'

export const ChallengeResultSlot = () => {
  const alertDialogRef = useRef<AlertDialogRef | null>(null)
  const { isAccountAuthenticated } = useAuthContext()
  const { challengingService } = useRestContext()
  const {
    challenge,
    results,
    userOutputs,
    isAnswered,
    userAnswer,
    isLeavingPage,
    codeExecutionErrorsCount,
    isBlocked,
    blockedReason,
    handleUserAnswer,
  } = useChallengeResultSlot({
    alertDialogRef,
    challengingService,
    isAccountAuthenticated,
  })

  if (challenge)
    return (
      <ChallengeResultSlotView
        alertDialogRef={alertDialogRef}
        challenge={challenge}
        results={results}
        userOutputs={userOutputs}
        isAnswered={isAnswered}
        userAnswer={userAnswer}
        isLeavingPage={isLeavingPage}
        codeExecutionErrorsCount={codeExecutionErrorsCount}
        isBlocked={isBlocked}
        blockedReason={blockedReason}
        handleUserAnswer={handleUserAnswer}
      />
    )
}
