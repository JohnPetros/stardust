import { useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'

import type { ActionParams } from '@/server/next-safe-action/types'
import { challengingActions } from '@/server/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type PostChallengeActionProps = {
  onSuccess: VoidFunction
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
        if (data) onSuccess()
      },
    },
  )

  const postChallenge = useCallback(
    async (params: ActionParams<typeof challengingActions.postChallenge>) => {
      await executeAsync(params)
    },
    [executeAsync],
  )

  console.log('post', result.serverError)
  console.log('post', result.validationErrors)

  return {
    isPosting: isPending,
    isPostFailure: hasErrored,
    postChallenge,
  }
}
