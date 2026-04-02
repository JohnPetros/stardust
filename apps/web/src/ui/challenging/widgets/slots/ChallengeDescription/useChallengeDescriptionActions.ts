'use client'

import { useAction } from 'next-safe-action/hooks'
import { useCallback } from 'react'

import type { ChallengeVote } from '@stardust/core/challenging/structures'
import { challengingActions } from '@/rpc/next-safe-action'
import { ActionResponse } from '@stardust/core/global/responses'

type VoteChallengeResponse = {
  userChallengeVote: string
}

type UpdateChallengeVisibilityResponse = {
  isPublic: boolean
}

export function useChallengeDescriptionActions() {
  const { executeAsync: executeVoteChallenge } = useAction(
    challengingActions.voteChallenge,
  )
  const { executeAsync: executeUpdateChallengeVisibility } = useAction(
    challengingActions.updateChallengeVisibility,
  )

  const voteChallenge = useCallback(
    async (challengeId: string, challengeVote: ChallengeVote['value']) => {
      const response = await executeVoteChallenge({ challengeId, challengeVote })

      return response?.serverError
        ? new ActionResponse<VoteChallengeResponse>({
            errorMessage: response.serverError,
          })
        : new ActionResponse<VoteChallengeResponse>({ data: response?.data })
    },
    [executeVoteChallenge],
  )

  const updateChallengeVisibility = useCallback(
    async (challengeId: string, isPublic: boolean) => {
      const response = await executeUpdateChallengeVisibility({ challengeId, isPublic })

      return response?.serverError
        ? new ActionResponse<UpdateChallengeVisibilityResponse>({
            errorMessage: response.serverError,
          })
        : new ActionResponse<UpdateChallengeVisibilityResponse>({ data: response?.data })
    },
    [executeUpdateChallengeVisibility],
  )

  return {
    voteChallenge,
    updateChallengeVisibility,
  }
}
