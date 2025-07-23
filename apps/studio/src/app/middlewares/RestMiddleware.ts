import type { Route } from '../+types/root'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { ENV } from '@/constants'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import { AuthService, SpaceService } from '@/rest/services'
import { authContext } from '../contexts/authContext'
import { restContext } from '../contexts/restContext'

export const RestMiddleware = async ({ context }: Route.ActionArgs) => {
  const { accessToken } = context.get(authContext)
  const restClient = AxiosRestClient()
  restClient.setBaseUrl(ENV.serverAppUrl)

  restClient.setHeader(
    HTTP_HEADERS.authorization,
    `Bearer ${accessToken.replaceAll('"', '')}`,
  )

  const authService = AuthService(restClient)
  const spaceService = SpaceService(restClient)

  context.set(restContext, {
    authService,
    spaceService,
  })
}
