import { useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'

import type { SnippetDto } from '@stardust/core/playground/dtos'

import type { ActionParams } from '@/server/next-safe-action/types'
import { playgroundActions } from '@/server/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { Snippet } from '@stardust/core/playground/entities'

type EditSnippetActionProps = {
  onSuccess: (snippet: Snippet) => void
  onError: VoidFunction
}

const action = playgroundActions.editSnippet

export function useEditSnippetAction({ onSuccess, onError }: EditSnippetActionProps) {
  const toast = useToastContext()
  const { executeAsync, isPending, hasErrored } = useAction(action, {
    onError: ({ error }) => {
      if (error.serverError) toast.show(error.serverError)
      onError()
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
    editSnippet,
  }
}
