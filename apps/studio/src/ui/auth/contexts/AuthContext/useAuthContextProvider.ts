import { useCallback, useMemo, useState } from 'react'
import { useSessionStorage } from 'usehooks-ts'

import type { AuthService } from '@stardust/core/auth/interfaces'
import type { Email } from '@stardust/core/global/structures'
import type { Password } from '@stardust/core/auth/structures'
import { Account } from '@stardust/core/auth/entities'

import { CACHE, ROUTES, SESSION_STORAGE_KEYS } from '@/constants'
import { useToast } from '@/ui/global/hooks/useToast'
import { useCache } from '@/ui/global/hooks/useCache'
import { useRouter } from '@/ui/global/hooks/useRouter'
import type { AuthContextValue } from './AuthContextValue'

type Params = {
  authService: AuthService
}

export function useAuthContextProvider({ authService }: Params) {
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [_, setAccessToken] = useSessionStorage(SESSION_STORAGE_KEYS.accessToken, '')
  const toast = useToast()
  const router = useRouter()
  const {
    data: accountDto,
    isLoading,
    updateCache,
  } = useCache({
    key: CACHE.account.key,
    canShowErrorMessage: false,
    shouldRefetchOnFocus: false,
    fetcher: authService.fetchAccount,
    onError: () => router.goTo(ROUTES.index),
  })

  const signIn = useCallback(
    async (email: Email, password: Password) => {
      setIsSigningIn(true)
      const response = await authService.signIn(email, password)

      if (response.isSuccessful) {
        toast.showSuccess('Login realizado com sucesso')
        setAccessToken(response.body.accessToken)
        updateCache(response.body.account)
        router.goTo(ROUTES.space.planets)
      }

      if (response.isFailure) toast.showError(response.errorMessage)

      setIsSigningIn(false)
    },
    [authService, toast, router.goTo, updateCache, setAccessToken],
  )

  const signOut = useCallback(async () => {
    const response = await authService.signOut()

    if (response.isFailure) {
      setAccessToken('')
      toast.showError(response.errorMessage)
    }

    if (response.isSuccessful) {
      updateCache(null)
      router.goTo(ROUTES.index)
    }
  }, [authService, toast, router, updateCache, setAccessToken])

  const value: AuthContextValue = useMemo(() => {
    return {
      account: accountDto ? Account.create(accountDto) : null,
      isLoading: isLoading || isSigningIn,
      signIn,
      signOut,
    }
  }, [accountDto, isLoading, isSigningIn, signIn, signOut])

  return value
}
