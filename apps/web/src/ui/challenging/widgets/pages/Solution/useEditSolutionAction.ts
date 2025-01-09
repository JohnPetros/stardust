import { useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'

import { Solution } from '@stardust/core/challenging/entities'

import type { ActionParams } from '@/server/next-safe-action/types'
import { challengingActions } from '@/server/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type EditSolutionActionProps = {
  onSuccess: (updatedSolution: Solution) => void
  onError: (solutionTitleError: string, solutionContentError: string) => void
}

export function useEditSolutionAction({ onSuccess, onError }: EditSolutionActionProps) {
  const toast = useToastContext()
  const { executeAsync, isPending } = useAction(challengingActions.editSolution, {
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

  const editSolution = useCallback(
    async (params: ActionParams<typeof challengingActions.editSolution>) => {
      const result = await executeAsync(params)
      return result?.data
    },
    [executeAsync],
  )

  return {
    isEditing: isPending,
    editSolution,
  }
}
