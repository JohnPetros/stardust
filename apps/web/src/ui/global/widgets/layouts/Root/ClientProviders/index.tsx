'use client'

import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import posthog, { type PostHogInterface } from 'posthog-js'

import { CLIENT_ENV } from '@/constants'
import { markAnalyticsProviderAsInitialized } from '@/provision/analytics/useAnalyticsProvider'
import { EditorProvider } from '@/ui/global/contexts/EditorContext'
import { RealtimeContextProvider } from '@/ui/global/contexts/RealtimeContext'
import { RestContextProvider } from '@/ui/global/contexts/RestContext'

type ClientProps = {
  accountDto?: AccountDto | null
  children: ReactNode
}

export const ClientProviders = ({ accountDto, children }: ClientProps) => {
  useEffect(() => {
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
      loaded(client: PostHogInterface) {
        client.register({ platform: 'web' })

        if (accountDto?.id && accountDto.email) {
          client.identify(accountDto.id, {
            email: accountDto.email,
          })
        }

        markAnalyticsProviderAsInitialized()
      },
    })
  }, [])

  return (
    <TooltipProvider>
      <RestContextProvider>
        <RealtimeContextProvider>
          <EditorProvider>{children}</EditorProvider>
        </RealtimeContextProvider>
      </RestContextProvider>
    </TooltipProvider>
  )
}
