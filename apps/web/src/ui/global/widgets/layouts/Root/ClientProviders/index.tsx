'use client'

import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import posthog, { type PostHogInterface } from 'posthog-js'

import { CLIENT_ENV } from '@/constants'
import {
  exposeProfileChannelMock,
  profileChannelMock,
} from '@/app/tests/shared/utils/exposeProfileChannelMock'
import { markAnalyticsProviderAsInitialized } from '@/provision/analytics/useAnalyticsProvider'
import { EditorProvider } from '@/ui/global/contexts/EditorContext'
import { RealtimeContextProvider } from '@/ui/global/contexts/RealtimeContext'
import { RestContextProvider } from '@/ui/global/contexts/RestContext'

type ClientProps = {
  accountDto?: AccountDto | null
  children: ReactNode
}

export const ClientProviders = ({ accountDto, children }: ClientProps) => {
  const isTestingMode =
    CLIENT_ENV.mode === 'testing' ||
    (typeof window !== 'undefined' && window.location.port === '3100')

  useEffect(() => {
    if (isTestingMode) {
      exposeProfileChannelMock()
    }

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
        client.register({
          platform: 'web',
          environment: CLIENT_ENV.mode,
        })

        if (accountDto?.id && accountDto.email) {
          client.identify(accountDto.id, {
            email: accountDto.email,
          })
        }

        markAnalyticsProviderAsInitialized()
      },
    })
  }, [isTestingMode])

  const testingProfileChannel = isTestingMode ? profileChannelMock : undefined

  return (
    <TooltipProvider>
      <RestContextProvider>
        <RealtimeContextProvider profileChannel={testingProfileChannel}>
          <EditorProvider>{children}</EditorProvider>
        </RealtimeContextProvider>
      </RestContextProvider>
    </TooltipProvider>
  )
}
