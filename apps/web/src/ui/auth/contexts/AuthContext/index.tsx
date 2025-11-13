'use client'

import { createContext, type PropsWithChildren } from 'react'

import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { HTTP_HEADERS } from '@stardust/core/global/constants'

import { CLIENT_ENV } from '@/constants'
import { ProfileService } from '@/rest/services'
import { NextRestClient } from '@/rest/next/NextRestClient'
import type { AuthContextValue } from './types'
import {
  useAuthContext,
  useAuthContextProvider,
  useSignInAction,
  useSignOutAction,
  useSignUpWithSocialAccountAction,
} from './hooks'

type Props = {
  accountDto: AccountDto | null
  accessToken: string | null
}

const restClient = NextRestClient({ isCacheEnabled: false })
restClient.setBaseUrl(CLIENT_ENV.stardustServerUrl)

export const AuthContext = createContext({} as AuthContextValue)

export const AuthContextProvider = ({
  accountDto,
  accessToken,
  children,
}: PropsWithChildren<Props>) => {
  if (accessToken)
    restClient.setHeader(HTTP_HEADERS.authorization, `Bearer ${accessToken}`)
  const profileService = ProfileService(restClient)
  const { signUpWithSocialAccount } = useSignUpWithSocialAccountAction()
  const { signIn } = useSignInAction()
  const { signOut } = useSignOutAction()
  const authContextValue = useAuthContextProvider({
    profileService,
    accountDto,
    signIn,
    signOut,
    signUpWithSocialAccount,
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
