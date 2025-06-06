import type { RestClient } from '@stardust/core/global/interfaces'

import { HTTP_HEADERS } from '@stardust/core/global/constants'
import { cookieActions } from '@/rpc/next-safe-action'
import { CLIENT_ENV, COOKIES } from '@/constants'
import type { NextRestClientConfig } from './types'

import { NextRestClient } from './NextRestClient'

export const NextServerRestClient = async (
  config?: NextRestClientConfig,
): Promise<RestClient> => {
  const accessToken = await cookieActions.getCookie(COOKIES.accessToken.key)
  const restClient = NextRestClient(config)
  restClient.setBaseUrl(CLIENT_ENV.serverAppUrl)
  restClient.setHeader(HTTP_HEADERS.authorization, `Bearer ${accessToken?.data}`)
  return restClient
}
