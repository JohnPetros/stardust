import { useCallback } from 'react'

import type { RestClient } from '@stardust/core/global/interfaces'
import { ActionResponse } from '@stardust/core/global/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'

import { AuthService } from '@/rest/services'

export function useRetryUserCreationAction(restClient: RestClient) {
  const retryUserCreation = useCallback(async (): Promise<ActionResponse<void>> => {
    const service = AuthService(restClient)
    const response = await service.retryUserCreation()
    // Um 409 significa que o perfil já existe (ex.: criado entre o 404 inicial e
    // o clique no retry, com o evento realtime perdido). No fluxo de recuperação
    // isso é sucesso: o perfil está lá, basta o cliente revalidar.
    if (response.isFailure && response.statusCode !== HTTP_STATUS_CODE.conflict) {
      return new ActionResponse({ errorMessage: response.errorMessage })
    }
    return new ActionResponse()
  }, [restClient])

  return { retryUserCreation }
}
