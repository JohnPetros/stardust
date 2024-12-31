import { useCallback, useState } from 'react'
import { useAction } from 'next-safe-action/hooks'

import type { ChallengeVote } from '@stardust/core/challenging/types'
import { AppError } from '@stardust/core/global/errors'

import { challengingActions } from '@/server/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type UseVoteChallengeActionProps = {
  onError: VoidFunction
}

export function useVoteChallengeAction({ onError }: UseVoteChallengeActionProps) {
  const toast = useToastContext()
  const { executeAsync, isPending } = useAction(challengingActions.voteChallenge, {
    onError: ({ error }) => {
      toast.show(String(error.serverError))
      onError()
    },
  })

  const voteChallenge = useCallback(
    async (challengeId: string, userChallengeVote: ChallengeVote) => {
      const result = await executeAsync({
        challengeId,
        userChallengeVote: userChallengeVote === 'upvote' ? 'upvote' : 'downvote',
      })
      if (!result?.data) throw new AppError('Erro ao votar nesse desafio')
      return result.data
    },
    [executeAsync],
  )

  return {
    voteChallenge,
    isExecuting: isPending,
  }
}
