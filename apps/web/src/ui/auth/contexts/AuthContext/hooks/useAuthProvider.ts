import { useCallback, useEffect, useState } from 'react'

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

export function useAuthProvider({
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
  })

  const notifyUserChanges = useCallback(() => {
    const userChangeEvent = new Event(DOM_EVENTS.userChange)
    window.dispatchEvent(userChangeEvent)
  }, [])

  async function handleSignIn(email: string, password: string) {
    const response = await signIn(email, password)

    if (response.isSuccessful) {
      setAccount(Account.create(response.data))
      return true
    }

    toast.showError(response.errorMessage, 10)
    return false
  }

  async function handleSignUpWithSocialAccount(
    accessToken: string,
    refreshToken: string,
  ) {
    const response = await signUpWithSocialAccount(accessToken, refreshToken)

    console.log('auth provider response', response)

    if (response.isSuccessful) {
      setAccount(Account.create(response.data.account))
      return { isNewAccount: response.data.isNewAccount }
    }

    return { isNewAccount: false }
  }

  async function handleSignOut() {
    const response = await signOut()

    if (response.isFailure) {
      toast.showError(response.errorMessage, 4)
      return
    }
  }

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

  return {
    user: userDto ? User.create(userDto) : null,
    account,
    isLoading,
    handleSignIn,
    handleSignOut,
    handleSignUpWithSocialAccount,
    updateUser,
    refetchUser: refetch,
    updateUserCache,
    notifyUserChanges,
  }
}
