import type { Route } from '../+types/root'
import { HTTP_HEADERS } from '@stardust/core/global/constants'
import { HTTP_STATUS_CODE } from '@stardust/core/global/constants'
import { Text } from '@stardust/core/global/structures'

import { ENV, ROUTES, SESSION_STORAGE_KEYS } from '@/constants'
import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import {
  AuthService,
  SpaceService,
  StorageService,
  LessonService,
  ProfileService,
  ChallengingService,
  ShopService,
  ManualService,
  ReportingService,
} from '@/rest/services'
import { authContext } from '../contexts/AuthContext'
import { restContext } from '../contexts/RestContext'
import { redirect } from 'react-router'

export const RestMiddleware = async ({ context }: Route.ActionArgs) => {
  const { accessToken } = context.get(authContext)
  const refreshToken = sessionStorage.getItem(SESSION_STORAGE_KEYS.refreshToken)

  const normalizedAccessToken = accessToken.replaceAll('"', '').trim()
  const normalizedRefreshToken = refreshToken?.replaceAll('"', '').trim() ?? ''
  const restClient = AxiosRestClient()
  restClient.setBaseUrl(ENV.stardustServerUrl)

  restClient.setHeader(HTTP_HEADERS.authorization, `Bearer ${normalizedAccessToken}`)

  const authService = AuthService(restClient)
  let accountResponse = await authService.fetchAccount()

  const shouldTryRefresh =
    accountResponse.statusCode === HTTP_STATUS_CODE.unauthorized &&
    Boolean(normalizedRefreshToken)

  if (shouldTryRefresh) {
    const refreshResponse = await authService.refreshSession(
      Text.create(normalizedRefreshToken),
    )

    if (refreshResponse.isSuccessful) {
      sessionStorage.setItem(
        SESSION_STORAGE_KEYS.accessToken,
        JSON.stringify(refreshResponse.body.accessToken),
      )
      sessionStorage.setItem(
        SESSION_STORAGE_KEYS.refreshToken,
        JSON.stringify(refreshResponse.body.refreshToken),
      )

      restClient.setHeader(
        HTTP_HEADERS.authorization,
        `Bearer ${refreshResponse.body.accessToken}`,
      )

      context.set(authContext, {
        accessToken: refreshResponse.body.accessToken,
      })

      accountResponse = await authService.fetchAccount()
    }
  }

  if (
    accountResponse.isFailure &&
    accountResponse.statusCode !== HTTP_STATUS_CODE.unauthorized
  ) {
    accountResponse.throwError()
  }

  if (accountResponse.isFailure) {
    throw redirect(ROUTES.index)
  }

  const spaceService = SpaceService(restClient)
  const storageService = StorageService(restClient)
  const lessonService = LessonService(restClient)
  const profileService = ProfileService(restClient)
  const challengingService = ChallengingService(restClient)
  const shopService = ShopService(restClient)
  const manualService = ManualService(restClient)
  const reportingService = ReportingService(restClient)

  context.set(restContext, {
    authService,
    spaceService,
    storageService,
    lessonService,
    profileService,
    challengingService,
    shopService,
    manualService,
    reportingService,
  })
}
