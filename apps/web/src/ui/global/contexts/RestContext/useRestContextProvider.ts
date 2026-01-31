'use client'

import { useMemo, useEffect } from 'react'
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
  ManualService,
  LessonService,
  NotificationService,
  ConversationService,
  ReportingService,
  StorageService,
} from '@/rest/services'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import type { RestContextValue } from './types'

const restClient = NextRestClient({ isCacheEnabled: false })
restClient.setBaseUrl(CLIENT_ENV.stardustServerUrl)

export function useRestContextProvider(): RestContextValue {
  const { accessToken } = useAuthContext()

  useEffect(() => {
    if (accessToken) {
      restClient.setHeader(HTTP_HEADERS.authorization, `Bearer ${accessToken}`)
    } else {
      restClient.setHeader(HTTP_HEADERS.authorization, '')
    }
  }, [accessToken])

  return useMemo(
    () => ({
      authService: AuthService(restClient),
      profileService: ProfileService(restClient),
      spaceService: SpaceService(restClient),
      shopService: ShopService(restClient),
      challengingService: ChallengingService(restClient),
      forumService: ForumService(restClient),
      playgroundService: PlaygroundService(restClient),
      manualService: ManualService(restClient),
      lessonService: LessonService(restClient),
      notificationService: NotificationService(restClient),
      conversationService: ConversationService(restClient),
      reportingService: ReportingService(restClient),
      storageService: StorageService(restClient),
    }),
    [],
  )
}
