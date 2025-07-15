import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { CLIENT_ENV } from '@/constants'
import { NextRestClient } from '@/rest/next/NextRestClient'
import {
  AuthService,
  ProfileService,
  SpaceService,
  ShopService,
  ChallengingService,
  ForumService,
  PlaygroundService,
  DocumentationService,
} from '@/rest/services'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { StorageService } from '@/rest/services/StorageService'

const restClient = NextRestClient({ isCacheEnabled: false })
restClient.setBaseUrl(CLIENT_ENV.serverAppUrl)

export function useRest() {
  const { accessToken } = useAuthContext()

  if (accessToken) {
    restClient.setHeader(HTTP_HEADERS.authorization, `Bearer ${accessToken}`)
  }

  return {
    authService: AuthService(restClient),
    profileService: ProfileService(restClient),
    spaceService: SpaceService(restClient),
    shopService: ShopService(restClient),
    challengingService: ChallengingService(restClient),
    forumService: ForumService(restClient),
    playgroundService: PlaygroundService(restClient),
    documentationService: DocumentationService(restClient),
    storageService: StorageService(restClient),
  }
}
