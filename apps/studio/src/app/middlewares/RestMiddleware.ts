import type { Route } from '../+types/root'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { ENV, ROUTES } from '@/constants'
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
  const restClient = AxiosRestClient()
  restClient.setBaseUrl(ENV.stardustServerUrl)

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
