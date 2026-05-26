import { useMemo } from 'react'
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

export function useRestContextProvider(): RestContextValue {
  const [accessToken] = useSessionStorage(SESSION_STORAGE_KEYS.accessToken, '')

  const restClient = useMemo(() => {
    const client = AxiosRestClient()
    client.setBaseUrl(ENV.stardustServerUrl)

    if (accessToken) {
      client.setHeader(HTTP_HEADERS.authorization, `Bearer ${accessToken}`)
    }

    return client
  }, [accessToken])

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
    [restClient],
  )
}
