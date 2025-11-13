import type { ReactNode } from 'react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { COOKIES } from '@/constants'
import { cookieActions } from '@/rpc/next-safe-action'
import { AuthService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { ToastContextProvider } from '@/ui/global/contexts/ToastContext'
import { AuthContextProvider } from '@/ui/auth/contexts/AuthContext'
import { AudioContextProvider } from '@/ui/global/contexts/AudioContext'

type Props = {
  children: ReactNode
}

export const ServerProviders = async ({ children }: Props) => {
  const restClient = await NextServerRestClient({ isCacheEnabled: false })
  const authService = AuthService(restClient)
  const response = await authService.fetchAccount()
  const accountDto = response.isSuccessful ? response.body : null
  const accessToken = await cookieActions.getCookie(COOKIES.accessToken.key)
  const isAudioDisabled = await cookieActions.getCookie(COOKIES.isAudioDisabled.key)

  return (
    <NuqsAdapter>
      <ToastContextProvider>
        <AudioContextProvider isDefaultAudioDisabled={Boolean(isAudioDisabled?.data)}>
          <AuthContextProvider
            accountDto={accountDto}
            accessToken={accessToken?.data ?? null}
          >
            {children}
          </AuthContextProvider>
        </AudioContextProvider>
      </ToastContextProvider>
    </NuqsAdapter>
  )
}
