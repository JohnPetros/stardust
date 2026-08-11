'use client'

import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import type { ReactNode } from 'react'
import { useEffect } from 'react'

import { CLIENT_ENV } from '@/constants'
import { markAnalyticsProviderAsInitialized } from '@/provision/analytics/useAnalyticsProvider'
import { ClientProvidersView } from './ClientProvidersView'

type ClientProps = {
  accountDto?: AccountDto | null
  children: ReactNode
}

export const ClientProviders = ({ accountDto, children }: ClientProps) => {
  const isTestingMode =
    CLIENT_ENV.mode === 'testing' ||
    (typeof window !== 'undefined' && window.location.port === '3100')

  useEffect(() => {
    let isCancelled = false

    async function initializePostHog() {
      const { default: posthog } = await import('posthog-js')
      if (isCancelled) return

      posthog.init(CLIENT_ENV.posthogProjectToken, {
        api_host: CLIENT_ENV.posthogHost,
        autocapture: true,
        capture_pageview: true,
        bootstrap: accountDto?.id
          ? {
              distinctID: accountDto.id,
              isIdentifiedID: true,
            }
          : undefined,
        session_recording: {
          maskAllInputs: true,
        },
        loaded(client) {
          client.register({
            platform: 'web',
            environment: CLIENT_ENV.mode,
          })

          if (accountDto?.id && accountDto.email) {
            client.identify(accountDto.id, {
              email: accountDto.email,
            })
          }

          markAnalyticsProviderAsInitialized(client)
        },
      })
    }

    void initializePostHog()

    return () => {
      isCancelled = true
    }
  }, [accountDto?.email, accountDto?.id])

  return (
    <ClientProvidersView isTestingMode={isTestingMode}>{children}</ClientProvidersView>
  )
}
