import { RestResponse } from '@stardust/core/global/responses'

import { parseResponseJson } from './parseResponseJson'
import { getCookie, setCookie } from '@/rpc/next-safe-action/cookieActions'
import { CLIENT_ENV, COOKIES } from '@/constants'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import type { SessionDto } from '@stardust/core/auth/structures/dtos'
import { NextRestClient } from '../NextRestClient'
import { AuthService } from '@/rest/services'
import { Text } from '@stardust/core/global/structures'

async function refreshAuthSession() {
  const refreshToken = await getCookie(COOKIES.refreshToken.key)
  if (!refreshToken?.data) {
    return new RestResponse<SessionDto>({ statusCode: HTTP_STATUS_CODE.badRequest })
  }

  const restClient = NextRestClient()
  restClient.setBaseUrl(CLIENT_ENV.stardustServerUrl)
  const service = AuthService(restClient)
  const response = await service.refreshSession(Text.create(refreshToken.data))

  if (response.isFailure) return response

  await Promise.all([
    setCookie({
      key: COOKIES.accessToken.key,
      value: response.body.accessToken,
      durationInSeconds: response.body.durationInSeconds,
    }),
    setCookie({
      key: COOKIES.refreshToken.key,
      value: response.body.refreshToken,
      durationInSeconds: response.body.durationInSeconds,
    }),
  ])

  return response
}

function isRefreshSessionRoute(url: string): boolean {
  if (!url) return false

  try {
    return new URL(url).pathname.endsWith('/auth/refresh-session')
  } catch {
    return url.endsWith('/auth/refresh-session')
  }
}

export async function handleRestError<Body = unknown>(
  response: globalThis.Response,
  failedRequest: () => Promise<RestResponse<Body>>,
  onRefreshSuccess?: (session: SessionDto) => void,
) {
  const isClientSide = typeof window !== 'undefined'
  const shouldRefreshSession =
    isClientSide &&
    response.status === HTTP_STATUS_CODE.unauthorized &&
    !isRefreshSessionRoute(response.url)

  if (shouldRefreshSession) {
    const refreshResponse = await refreshAuthSession()

    if (refreshResponse.isSuccessful) {
      onRefreshSuccess?.(refreshResponse.body)
      return await failedRequest()
    }
  }

  const data = await parseResponseJson(response)

  if (data && 'title' in data && 'message' in data) {
    console.warn('Rest Api error title:', data.title)
    console.warn('Rest Api error message:', data.message)

    return new RestResponse<Body>({
      errorMessage: String(data.message),
      statusCode: response.status,
    })
  }

  console.warn('Unhandled Rest Api error:', response.status)

  return new RestResponse<Body>({ statusCode: response.status })
}
