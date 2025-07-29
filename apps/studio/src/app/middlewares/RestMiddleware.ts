import type { Route } from '../+types/root'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { ENV, ROUTES } from '@/constants'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import { AuthService, SpaceService, StorageService } from '@/rest/services'
import { authContext } from '../contexts/authContext'
import { restContext } from '../contexts/restContext'
import { redirect } from 'react-router'

export const RestMiddleware = async ({ context }: Route.ActionArgs) => {
  const { accessToken } = context.get(authContext)
  const restClient = AxiosRestClient()
  restClient.setBaseUrl(ENV.serverAppUrl)

  restClient.setHeader(
    HTTP_HEADERS.authorization,
    `Bearer ${accessToken.replaceAll('"', '')}`,
  )

  const authService = AuthService(restClient)
  const response = await authService.fetchAccount()
  const hasSession = response.isSuccessful

  if (!hasSession) {
    throw redirect(ROUTES.index)
  }

  const spaceService = SpaceService(restClient)
  const storageService = StorageService(restClient)

  context.set(restContext, {
    authService,
    spaceService,
    storageService,
  })
}
