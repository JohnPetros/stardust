'use client'

import type { PostHogInterface } from 'posthog-js'
import { useMemo } from 'react'

import type { ClientAnalyticsProvider } from '@stardust/core/analytics/interfaces'

import { CLIENT_ENV } from '@/constants'

let isPostHogInitialized = false
let postHogClient: PostHogInterface | null = null
let pendingIdentity: { userId: string; userEmail: string } | null = null

export function markAnalyticsProviderAsInitialized(client: PostHogInterface) {
  postHogClient = client
  isPostHogInitialized = true
  if (!pendingIdentity) return

  postHogClient.identify(pendingIdentity.userId, {
    email: pendingIdentity.userEmail,
  })
  pendingIdentity = null
}

export function useAnalyticsProvider(): ClientAnalyticsProvider {
  return useMemo(
    () => ({
      trackEvent(eventName, properties) {
        if (!isPostHogInitialized || !postHogClient) return

        postHogClient.capture(eventName, properties)
      },
      identifyUser(userId, userEmail) {
        if (!isPostHogInitialized) {
          pendingIdentity = {
            userId: userId.value,
            userEmail: userEmail.value,
          }
          return
        }

        postHogClient?.identify(userId.value, {
          email: userEmail.value,
        })
      },
      reset() {
        pendingIdentity = null
        if (!isPostHogInitialized || !postHogClient) return

        postHogClient.reset()
        postHogClient.register({
          platform: 'web',
          environment: CLIENT_ENV.mode,
        })
      },
    }),
    [],
  )
}
