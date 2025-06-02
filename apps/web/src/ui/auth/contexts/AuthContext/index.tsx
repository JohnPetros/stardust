'use client'

import { createContext, type PropsWithChildren } from 'react'

import type { AccountDto } from '@stardust/core/auth/entities/dtos'

import type { AuthContextValue } from './types'
import { useAuthProvider, useAuthContext } from './hooks'
import { useSignInAction } from './hooks/useSignInAction'
import { AuthService, ProfileService } from '@/rest/services'
import { NextRestClient } from '@/rest/next/NextRestClient'
import { CLIENT_ENV } from '@/constants'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

type Props = {
  accountDto: AccountDto | null
  accessToken: string | null
}

const restClient = NextRestClient({ isCacheEnabled: false })
restClient.setBaseUrl(CLIENT_ENV.serverAppUrl)

export const AuthContext = createContext({} as AuthContextValue)

export const AuthProvider = ({
  accountDto,
  accessToken,
  children,
}: PropsWithChildren<Props>) => {
  if (accessToken)
    restClient.setHeader(HTTP_HEADERS.authorization, `Bearer ${accessToken}`)
  const authService = AuthService(restClient)
  const profileService = ProfileService(restClient)
  const { runSignInAction } = useSignInAction()
  const authContextValue = useAuthProvider({
    authService,
    profileService,
    accountDto,
    runSignInAction,
  })

  return (
    <AuthContext.Provider
      value={{
        ...authContextValue,
        accessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export { useAuthContext }
