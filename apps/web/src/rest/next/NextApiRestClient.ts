import type { NextRequest } from 'next/server'

import type { RestClient } from '@stardust/core/global/interfaces'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { CLIENT_ENV, COOKIES } from '@/constants'
import type { NextRestClientConfig } from './types'

import { NextRestClient } from './NextRestClient'

export const NextApiRestClient = async (
  request: NextRequest,
  config?: NextRestClientConfig,
): Promise<RestClient> => {
  const restClient = NextRestClient(config)
  restClient.setBaseUrl(CLIENT_ENV.stardustServerUrl)

  const authorizationHeader = request.headers.get(HTTP_HEADERS.authorization)
  if (authorizationHeader) {
    restClient.setHeader(HTTP_HEADERS.authorization, authorizationHeader)
    return restClient
  }

  const accessToken = request.cookies.get(COOKIES.accessToken.key)
  if (accessToken?.value) {
    restClient.setHeader(HTTP_HEADERS.authorization, `Bearer ${accessToken.value}`)
  }

  return restClient
}
