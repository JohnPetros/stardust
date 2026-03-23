import { useCallback } from 'react'
import { useAction } from 'next-safe-action/hooks'

import { ActionResponse } from '@stardust/core/global/responses'

import { authActions } from '@/rpc/next-safe-action'

export function useRetryUserCreationAction() {
  const { executeAsync } = useAction(authActions.retryUserCreation)

  const retryUserCreation = useCallback(async (): Promise<ActionResponse<void>> => {
    const response = await executeAsync()
    console.log(response?.serverError)
    return response?.serverError
      ? new ActionResponse({ errorMessage: response.serverError })
      : new ActionResponse()
  }, [executeAsync])

  return { retryUserCreation }
}
