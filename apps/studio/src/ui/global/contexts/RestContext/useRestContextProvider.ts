import { useMemo, useEffect } from 'react'
import { useLocation } from 'react-router'
import { useSessionStorage } from 'usehooks-ts'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

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
import { ENV, SESSION_STORAGE_KEYS } from '@/constants'
import type { RestContextValue } from './types/RestContextValue'

const restClient = AxiosRestClient()
restClient.setBaseUrl(ENV.stardustServerUrl)

export function useRestContextProvider(): RestContextValue {
  const [accessToken] = useSessionStorage(SESSION_STORAGE_KEYS.accessToken, '')
  const location = useLocation()

  useEffect(() => {
    if (accessToken) {
      restClient.setHeader(HTTP_HEADERS.authorization, `Bearer ${accessToken}`)
    }
  }, [accessToken, location.pathname])

  return useMemo(
    () => ({
      spaceService: SpaceService(restClient),
      authService: AuthService(restClient),
      storageService: StorageService(restClient),
      lessonService: LessonService(restClient),
      profileService: ProfileService(restClient),
      challengingService: ChallengingService(restClient),
      shopService: ShopService(restClient),
      manualService: ManualService(restClient),
      reportingService: ReportingService(restClient),
    }),
    [],
  )
}
