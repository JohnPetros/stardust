import { cookies } from 'next/headers'

import type { RestClient } from '@stardust/core/global/interfaces'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { CLIENT_ENV, COOKIES } from '@/constants'
import type { NextRestClientConfig } from './types'

import { NextRestClient } from './NextRestClient'

export const NextServerRestClient = async (
  config?: NextRestClientConfig,
): Promise<RestClient> => {
  const restClient = NextRestClient(config)
  restClient.setBaseUrl(CLIENT_ENV.stardustServerUrl)

  const cookiesStore = await cookies()
  const accessToken = cookiesStore.get(COOKIES.accessToken.key)
  if (accessToken?.value) {
    restClient.setHeader(HTTP_HEADERS.authorization, `Bearer ${accessToken?.value}`)
  }

  return restClient
}
