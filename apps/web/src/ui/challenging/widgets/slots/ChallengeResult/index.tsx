'use client'

import { useChallengeResultSlot } from './useChallengeResultSlot'
import { ChallengeResultSlotView } from './ChallengeResultSlotView'

export const ChallengeResultSlot = () => {
  const { challenge, results, userAnswer, isLeavingPage, handleUserAnswer } =
    useChallengeResultSlot()

  if (challenge)
    return (
      <ChallengeResultSlotView
        challenge={challenge}
        results={results}
        userAnswer={userAnswer}
        isLeavingPage={isLeavingPage}
        handleUserAnswer={handleUserAnswer}
      />
    )
}
