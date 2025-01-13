import { useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'

import type { ActionParams } from '@/server/next-safe-action/types'
import { challengingActions } from '@/server/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type UpdateChallengeActionProps = {
  onSuccess: (challengeSlug: string) => void
}

const action = challengingActions.updateChallenge

export function useUpdateChallengeAction({ onSuccess }: UpdateChallengeActionProps) {
  const toast = useToastContext()
  const { executeAsync, isPending, hasErrored } = useAction(action, {
    onError: ({ error }) => {
      if (error.serverError) toast.show(error.serverError)
    },
    onSuccess: ({ data }) => {
      if (data?.slug) onSuccess(data?.slug)
    },
  })

  const updateChallenge = useCallback(
    async (params: ActionParams<typeof action>) => {
      const result = await executeAsync(params)
      return result?.data
    },
    [executeAsync],
  )

  return {
    isUpdating: isPending,
    isUpdateFailure: hasErrored,
    updateChallenge,
  }
}
