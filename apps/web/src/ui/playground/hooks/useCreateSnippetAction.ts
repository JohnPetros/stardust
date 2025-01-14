import { useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'

import type { SnippetDto } from '@stardust/core/playground/dtos'

import type { ActionParams } from '@/server/next-safe-action/types'
import { playgroundActions } from '@/server/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type CreateSnippetActionProps = {
  onSuccess: (snippetDto: SnippetDto) => void
  onError: VoidFunction
}

const action = playgroundActions.editSnippet

export function useCreateSnippetAction({ onSuccess, onError }: CreateSnippetActionProps) {
  const toast = useToastContext()
  const { executeAsync, isPending, hasErrored } = useAction(action, {
    onError: ({ error }) => {
      if (error.serverError) toast.show(error.serverError)
      onError()
    },
    onSuccess: ({ data }) => {
      if (data) onSuccess(data)
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
