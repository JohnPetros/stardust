import { useSessionStorage } from 'usehooks-ts'

import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { AxiosRestClient } from '@/rest/axios/AxiosRestClient'
import { AuthService, SpaceService, StorageService, LessonService } from '@/rest/services'
import { ENV, SESSION_STORAGE_KEYS } from '@/constants'

const restClient = AxiosRestClient()
restClient.setBaseUrl(ENV.serverAppUrl)

export function useRest() {
  const [accessToken] = useSessionStorage(SESSION_STORAGE_KEYS.accessToken, '')

  if (accessToken)
    restClient.setHeader(HTTP_HEADERS.authorization, `Bearer ${accessToken}`)

  return {
    spaceService: SpaceService(restClient),
    authService: AuthService(restClient),
    storageService: StorageService(restClient),
    lessonService: LessonService(restClient),
  }
}
