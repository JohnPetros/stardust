import { RestResponse } from '@stardust/core/global/responses'

import { parseResponseJson } from './parseResponseJson'
import { cookieActions } from '@/rpc/next-safe-action'
import { CLIENT_ENV, COOKIES } from '@/constants'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { SessionDto } from '@stardust/core/auth/structures/dtos'
import { NextRestClient } from '../NextRestClient'
import { AuthService } from '@/rest/services'
import { Text } from '@stardust/core/global/structures'

async function refreshAuthSession() {
  const refreshToken = await cookieActions.getCookie(COOKIES.refreshToken.key)
  if (!refreshToken?.data) {
    return new RestResponse<SessionDto>({ statusCode: HTTP_STATUS_CODE.badRequest })
  }

  const restClient = NextRestClient()
  restClient.setBaseUrl(CLIENT_ENV.stardustServerUrl)
  const service = AuthService(restClient)
  const response = await service.refreshSession(Text.create(refreshToken.data))

  await Promise.all([
    cookieActions.setCookie({
      key: COOKIES.accessToken.key,
      value: response.body.accessToken,
      durationInSeconds: response.body.durationInSeconds,
    }),
    cookieActions.setCookie({
      key: COOKIES.refreshToken.key,
      value: response.body.refreshToken,
      durationInSeconds: response.body.durationInSeconds,
    }),
  ])

  return response
}

export async function handleRestError<Body = unknown>(
  response: globalThis.Response,
  failedRequest: () => Promise<RestResponse<Body>>,
) {
  const isClientSide = typeof window !== 'undefined'
  if (isClientSide && response.status === HTTP_STATUS_CODE.unauthorized) {
    const refresResponse = await refreshAuthSession()
    if (refresResponse.isSuccessful) return await failedRequest()
  }

  const data = await parseResponseJson(response)

  console.log('handleRestError', data)

  if (data && 'title' in data && 'message' in data) {
    console.warn('Rest Api error title:', data.title)
    console.warn('Rest Api error message:', data.message)

    return new RestResponse<Body>({
      errorMessage: String(data.message),
      statusCode: response.status,
    })
  }

  return new RestResponse<Body>({ statusCode: response.status })
}
