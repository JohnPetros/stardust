'use client'

import { useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'

import type { ActionParams } from '@/server/next-safe-action/types'
import { challengingActions } from '@/server/next-safe-action'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { PaginationResponse } from '@stardust/core/responses'

export function useFetchChallengesListAction() {
  const toast = useToastContext()
  const { executeAsync } = useAction(challengingActions.fetchChallengesList, {
    onError: ({ error }) => {
      if (error.serverError) toast.show(error.serverError)
    },
  })

  const fetchList = useCallback(
    async (params: ActionParams<typeof challengingActions.fetchChallengesList>) => {
      const result = await executeAsync(params)
      return result?.data ?? new PaginationResponse([], 0)
    },
    [executeAsync],
  )

  return {
    fetchList,
  }
}
