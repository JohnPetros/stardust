import { useCallback, useEffect, useMemo, useState } from 'react'

import { User } from '@stardust/core/global/entities'
import type { ClientAnalyticsProvider } from '@stardust/core/analytics/interfaces'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { Account } from '@stardust/core/auth/entities'
import type { ActionResponse } from '@stardust/core/global/responses'

import {
  CACHE,
  DOM_EVENTS,
  PUBLIC_ROUTE_GROUPS,
  PUBLIC_ROUTES,
  ROUTES,
} from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useNavigationProvider } from '@/ui/global/hooks/useNavigationProvider'

type Params = {
  profileService: ProfileService
  analyticsProvider: ClientAnalyticsProvider
  accountDto: AccountDto | null
  signIn: (email: string, password: string) => Promise<ActionResponse<AccountDto>>
  signOut: () => Promise<ActionResponse<void>>
  retryUserCreation: () => Promise<ActionResponse<void>>
  signUpWithSocialAccount: (
    accessToken: string,
    refreshToken: string,
  ) => Promise<ActionResponse<{ isNewAccount: boolean; account: AccountDto }>>
}

export function useAuthContextProvider({
  profileService,
  analyticsProvider,
  accountDto,
  signIn,
  signOut,
  retryUserCreation,
  signUpWithSocialAccount,
}: Params) {
  const [account, setAccount] = useState<Account | null>(
    accountDto ? Account.create(accountDto) : null,
  )
  const toast = useToastContext()
  const navigationProvider = useNavigationProvider()

  async function fetchUser() {
    if (!account) return
    const response = await profileService.fetchUserById(account.id)
    return response.body
  }

  const {
    data: userDto,
    isLoading,
    updateCache,
    refetch,
  } = useCache({
    key: CACHE.keys.authUser,
    fetcher: fetchUser,
    isEnabled: Boolean(account),
    dependencies: [account?.id],
    shouldRefetchOnFocus: false,
  })

  const notifyUserChanges = useCallback(() => {
    const userChangeEvent = new Event(DOM_EVENTS.userChange)
    window.dispatchEvent(userChangeEvent)
  }, [])

  const handleSignIn = useCallback(
    async (email: string, password: string) => {
      const response = await signIn(email, password)

      if (response.isSuccessful) {
        const authenticatedAccount = Account.create(response.data)
        setAccount(authenticatedAccount)
        analyticsProvider.identifyUser(
          authenticatedAccount.id,
          authenticatedAccount.email,
        )
        return true
      }

      toast.showError(response.errorMessage, 10)
      return false
    },
    [analyticsProvider, signIn, toast],
  )

  const handleSignUpWithSocialAccount = useCallback(
    async (accessToken: string, refreshToken: string) => {
      const response = await signUpWithSocialAccount(accessToken, refreshToken)

      if (response.isSuccessful) {
        const authenticatedAccount = Account.create(response.data.account)
        setAccount(authenticatedAccount)
        analyticsProvider.identifyUser(
          authenticatedAccount.id,
          authenticatedAccount.email,
        )
        return { isNewAccount: response.data.isNewAccount }
      }

      return { isNewAccount: false }
    },
    [analyticsProvider, signUpWithSocialAccount],
  )

  const handleSignOut = useCallback(async () => {
    const response = await signOut()

    if (response.isFailure) {
      toast.showError(response.errorMessage, 4)
      return
    }

    analyticsProvider.reset()
  }, [analyticsProvider, signOut, toast])

  const handleRetryUserCreation = useCallback(async () => {
    const response = await retryUserCreation()

    if (response.isFailure) {
      toast.showError(response.errorMessage, 8)
      return false
    }

    return true
  }, [retryUserCreation, toast])

  const updateUserCache = useCallback(
    (userData: UserDto | null, shouldRevalidate = true) => {
      updateCache(userData, {
        shouldRevalidate,
      })
    },
    [updateCache],
  )

  const updateUser = useCallback(
    async (user: User) => {
      if (user?.id) {
        const response = await profileService.updateUser(user)

        if (response.isFailure) {
          toast.showError(response.errorMessage)
        }

        if (response.isSuccessful) {
          updateUserCache(user.dto)
        }
      }
    },
    [profileService, updateUserCache, toast],
  )

  useEffect(() => {
    if (account?.isAuthenticated.isFalse) {
      updateUserCache(null)
      return
    }

    if (account?.isAuthenticated.isTrue) {
      analyticsProvider.identifyUser(account.id, account.email)
    }
  }, [account, analyticsProvider, updateUserCache])

  useEffect(() => {
    const currentRoute = navigationProvider.currentRoute
    const isPublicRoute =
      PUBLIC_ROUTES.map(String).includes(currentRoute) ||
      PUBLIC_ROUTE_GROUPS.some((group) => currentRoute.startsWith(group))

    const shouldRedirectToAccountConfirmation =
      account?.isAuthenticated.isTrue &&
      !userDto &&
      !isLoading &&
      !isPublicRoute &&
      currentRoute !== ROUTES.auth.accountConfirmation

    if (!shouldRedirectToAccountConfirmation) return

    navigationProvider.goTo(ROUTES.auth.accountConfirmation)
  }, [
    account?.isAuthenticated.isTrue,
    userDto,
    isLoading,
    navigationProvider.currentRoute,
    navigationProvider.goTo,
  ])

  const user = useMemo(() => (userDto ? User.create(userDto) : null), [userDto])

  return useMemo(
    () => ({
      user,
      account,
      isAccountAuthenticated: account?.isAuthenticated.isTrue ?? false,
      isLoading,
      handleSignIn,
      handleSignOut,
      handleSignUpWithSocialAccount,
      handleRetryUserCreation,
      updateUser,
      refetchUser: refetch,
      updateUserCache,
      notifyUserChanges,
    }),
    [
      user,
      account,
      isLoading,
      handleSignIn,
      handleSignOut,
      handleSignUpWithSocialAccount,
      handleRetryUserCreation,
      updateUser,
      refetch,
      updateUserCache,
      notifyUserChanges,
    ],
  )
}
