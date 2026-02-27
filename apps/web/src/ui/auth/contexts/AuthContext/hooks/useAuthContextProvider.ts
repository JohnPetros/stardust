import { useCallback, useEffect, useMemo, useState } from 'react'

import { User } from '@stardust/core/global/entities'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { Account } from '@stardust/core/auth/entities'
import type { ActionResponse } from '@stardust/core/global/responses'

import { CACHE, DOM_EVENTS } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type Params = {
  profileService: ProfileService
  accountDto: AccountDto | null
  signIn: (email: string, password: string) => Promise<ActionResponse<AccountDto>>
  signOut: () => Promise<ActionResponse<void>>
  signUpWithSocialAccount: (
    accessToken: string,
    refreshToken: string,
  ) => Promise<ActionResponse<{ isNewAccount: boolean; account: AccountDto }>>
}

export function useAuthContextProvider({
  profileService,
  accountDto,
  signIn,
  signOut,
  signUpWithSocialAccount,
}: Params) {
  const [account, setAccount] = useState<Account | null>(
    accountDto ? Account.create(accountDto) : null,
  )
  const toast = useToastContext()

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
    isEnabled: Boolean(accountDto),
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
        setAccount(Account.create(response.data))
        return true
      }

      toast.showError(response.errorMessage, 10)
      return false
    },
    [signIn, toast],
  )

  const handleSignUpWithSocialAccount = useCallback(
    async (accessToken: string, refreshToken: string) => {
      const response = await signUpWithSocialAccount(accessToken, refreshToken)

      if (response.isSuccessful) {
        setAccount(Account.create(response.data.account))
        return { isNewAccount: response.data.isNewAccount }
      }

      return { isNewAccount: false }
    },
    [signUpWithSocialAccount],
  )

  const handleSignOut = useCallback(async () => {
    const response = await signOut()

    if (response.isFailure) {
      toast.showError(response.errorMessage, 4)
      return
    }
  }, [signOut, toast])

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
  }, [account, updateUserCache])

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
      updateUser,
      refetch,
      updateUserCache,
      notifyUserChanges,
    ],
  )
}
