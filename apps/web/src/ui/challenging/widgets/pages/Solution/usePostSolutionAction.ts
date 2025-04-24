import { useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'

import { Solution } from '@stardust/core/challenging/entities'

import type { ActionParams } from '@/rpc/next-safe-action/types'
import { challengingActions } from '@/rpc/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type PostSolutionActionProps = {
  onSuccess: (newSolution: Solution) => void
  onError: (solutionTitleError: string, solutionContentError: string) => void
}

export function usePostSolutionAction({ onSuccess, onError }: PostSolutionActionProps) {
  const toast = useToastContext()
  const { executeAsync, isPending } = useAction(challengingActions.postSolution, {
    onError: ({ error }) => {
      if (error.serverError) toast.show(error.serverError)
      onError(
        error.validationErrors?.solutionTitle?.join(',') ?? '',
        error.validationErrors?.solutionContent?.join(',') ?? '',
      )
    },
    onSuccess: ({ data }) => {
      if (data) onSuccess(Solution.create(data))
    },
  })

  const postSolution = useCallback(
    async (params: ActionParams<typeof challengingActions.postSolution>) => {
      const result = await executeAsync(params)
      return result?.data
    },
    [executeAsync],
  )

  return {
    isPosting: isPending,
    postSolution,
  }
}
