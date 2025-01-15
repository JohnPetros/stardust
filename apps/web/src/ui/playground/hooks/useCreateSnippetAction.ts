import { useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'

import { Snippet } from '@stardust/core/playground/entities'

import type { ActionParams } from '@/server/next-safe-action/types'
import { playgroundActions } from '@/server/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type CreateSnippetActionProps = {
  onSuccess: (snippet: Snippet) => void
  onError: (snippetTitleErrorMessage: string, snippetCodeErrorMessage: string) => void
}

const action = playgroundActions.createSnippet

export function useCreateSnippetAction({ onSuccess, onError }: CreateSnippetActionProps) {
  const toast = useToastContext()
  const { executeAsync, isPending, hasErrored } = useAction(action, {
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

  const createSnippet = useCallback(
    async (params: ActionParams<typeof action>) => {
      const result = await executeAsync(params)
      return result?.data
    },
    [executeAsync],
  )

  return {
    isCreating: isPending,
    isCreateFailure: hasErrored,
    createSnippet,
  }
}
