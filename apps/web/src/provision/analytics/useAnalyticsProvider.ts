'use client'

import posthog from 'posthog-js'

import type { ClientAnalyticsProvider } from '@stardust/core/analytics/interfaces'

let isPostHogInitialized = false
let pendingIdentity: { userId: string; userEmail: string } | null = null

export function markAnalyticsProviderAsInitialized() {
  isPostHogInitialized = true
  if (!pendingIdentity) return

  posthog.identify(pendingIdentity.userId, {
    email: pendingIdentity.userEmail,
  })
  pendingIdentity = null
}

export function useAnalyticsProvider(): ClientAnalyticsProvider {
  return {
    trackEvent(eventName, properties) {
      if (!isPostHogInitialized) return

      posthog.capture(eventName, properties)
    },
    identifyUser(userId, userEmail) {
      if (!isPostHogInitialized) {
        pendingIdentity = {
          userId: userId.value,
          userEmail: userEmail.value,
        }
        return
      }

      posthog.identify(userId.value, {
        email: userEmail.value,
      })
    },
    reset() {
      pendingIdentity = null
      if (!isPostHogInitialized) return

      posthog.reset()
      posthog.register({ platform: 'web' })
    },
  }
}
