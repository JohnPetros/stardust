import type { ReactNode } from 'react'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { AuthService } from '@/rest/services'
import { NextServerRestClient } from '@/rest/next/NextServerRestClient'
import { cookieActions } from '@/rpc/next-safe-action'
import { ToastProvider } from '@/ui/global/contexts/ToastContext'
import { AuthProvider } from '@/ui/auth/contexts/AuthContext'
import { COOKIES } from '@/constants'

type ServerProps = {
  children: ReactNode
}

export async function ServerProvider({ children }: ServerProps) {
  const restClient = await NextServerRestClient({ isCacheEnabled: false })
  const authService = AuthService(restClient)
  const response = await authService.fetchAccount()
  const accountDto = response.isSuccessful ? response.body : null
  const accessToken = await cookieActions.getCookie(COOKIES.accessToken.key)

  return (
    <NuqsAdapter>
      <ToastProvider>
        <AuthProvider accountDto={accountDto} accessToken={accessToken?.data ?? null}>
          {children}
        </AuthProvider>
      </ToastProvider>
    </NuqsAdapter>
  )
}
