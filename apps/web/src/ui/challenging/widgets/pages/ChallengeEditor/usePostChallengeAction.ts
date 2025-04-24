import { useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'

import type { ActionParams } from '@/rpc/next-safe-action/types'
import { challengingActions } from '@/rpc/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type PostChallengeActionProps = {
  onSuccess: (challengeSlug: string) => void
}

export function usePostChallengeAction({ onSuccess }: PostChallengeActionProps) {
  const toast = useToastContext()
  const { isPending, hasErrored, executeAsync, result } = useAction(
    challengingActions.postChallenge,
    {
      onError: ({ error }) => {
        if (error.serverError) toast.show(error.serverError)
      },
      onSuccess: ({ data }) => {
        if (data?.slug) onSuccess(data?.slug)
      },
    },
  )

  const postChallenge = useCallback(
    async (params: ActionParams<typeof challengingActions.postChallenge>) => {
      await executeAsync(params)
    },
    [executeAsync],
  )

  return {
    isPosting: isPending,
    isPostFailure: hasErrored,
    postChallenge,
  }
}
