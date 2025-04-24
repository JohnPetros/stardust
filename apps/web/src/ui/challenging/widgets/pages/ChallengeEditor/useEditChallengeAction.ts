import { useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'

import type { ActionParams } from '@/rpc/next-safe-action/types'
import { challengingActions } from '@/rpc/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type EditChallengeActionProps = {
  onSuccess: (challengeSlug: string) => void
}

const action = challengingActions.editChallenge

export function useEditChallengeAction({ onSuccess }: EditChallengeActionProps) {
  const toast = useToastContext()
  const { executeAsync, isPending, hasErrored } = useAction(action, {
    onError: ({ error }) => {
      if (error.serverError) toast.show(error.serverError)
    },
    onSuccess: ({ data }) => {
      if (data?.slug) onSuccess(data?.slug)
    },
  })

  const editChallenge = useCallback(
    async (params: ActionParams<typeof action>) => {
      const result = await executeAsync(params)
      return result?.data
    },
    [executeAsync],
  )

  return {
    isEditing: isPending,
    isEditFailure: hasErrored,
    editChallenge,
  }
}
