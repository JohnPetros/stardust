import { useCallback } from 'react'

import type { RestClient } from '@stardust/core/global/interfaces'
import { ActionResponse } from '@stardust/core/global/responses'

import { AuthService } from '@/rest/services'

export function useRetryUserCreationAction(restClient: RestClient) {
  const retryUserCreation = useCallback(async (): Promise<ActionResponse<void>> => {
    const service = AuthService(restClient)
    const response = await service.retryUserCreation()
    return response.isFailure
      ? new ActionResponse({ errorMessage: response.errorMessage })
      : new ActionResponse()
  }, [restClient])

  return { retryUserCreation }
}
