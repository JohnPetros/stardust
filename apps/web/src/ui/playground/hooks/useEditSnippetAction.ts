import { useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'

import type { SnippetDto } from '@stardust/core/playground/dtos'

import type { ActionParams } from '@/rpc/next-safe-action/types'
import { playgroundActions } from '@/rpc/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { Snippet } from '@stardust/core/playground/entities'

type EditSnippetActionProps = {
  onSuccess: (snippet: Snippet) => void
  onError: (snippetTitleErrorMessage: string, snippetCodeErrorMessage: string) => void
}

const action = playgroundActions.editSnippet

export function useEditSnippetAction({ onSuccess, onError }: EditSnippetActionProps) {
  const toast = useToastContext()
  const { executeAsync, isPending, hasErrored, result } = useAction(action, {
    onError: ({ error }) => {
      if (error.serverError) toast.show(error.serverError)
      if (error.validationErrors)
        onError(
          error.validationErrors.snippetTitle
            ? String(error.validationErrors.snippetTitle[0])
            : '',
          error.validationErrors.snippetCode
            ? String(error.validationErrors.snippetCode[0])
            : '',
        )
    },
    onSuccess: ({ data }) => {
      if (data) onSuccess(Snippet.create(data))
    },
  })

  const editSnippet = useCallback(
    async (params: ActionParams<typeof action>) => {
      const result = await executeAsync(params)
      return result?.data
    },
    [executeAsync],
  )

  return {
    isEditing: isPending,
    isEditFailure: hasErrored,
    editSnippetValidationErrors: result.validationErrors,
    editSnippet,
  }
}
