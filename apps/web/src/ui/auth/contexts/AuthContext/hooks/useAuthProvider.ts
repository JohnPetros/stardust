'use client'

import { useCallback, useEffect, useState } from 'react'

import { Observer } from '@stardust/core/global/structures'
import { User } from '@stardust/core/global/entities'
import type { UserDto } from '@stardust/core/profile/entities/dtos'
import type { AuthService } from '@stardust/core/auth/interfaces'
import type { ProfileService } from '@stardust/core/profile/interfaces'
import type { AccountDto } from '@stardust/core/auth/entities/dtos'
import { Account } from '@stardust/core/auth/entities'
import type { ActionResponse } from '@stardust/core/global/responses'

import { CACHE, DOM_EVENTS, ROUTES } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useToastContext } from '@/ui/global/contexts/ToastContext'

type Params = {
  authService: AuthService
  profileService: ProfileService
  accountDto: AccountDto | null
  runSignInAction: (
    email: string,
    password: string,
  ) => Promise<ActionResponse<AccountDto>>
}

export function useAuthProvider({
  authService,
  profileService,
  accountDto,
  runSignInAction,
}: Params) {
  const [account, setAccount] = useState<Account | null>(
    accountDto ? Account.create(accountDto) : null,
  )
  const router = useRouter()
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

  const setUser = useCallback(
    (userDto: UserDto | null) => {
      if (!userDto) return null

      const user = User.create(userDto)
      user.observer = new Observer(notifyUserChanges)
      return user
    },
    [notifyUserChanges],
  )

  async function handleSignIn(email: string, password: string) {
    const response = await runSignInAction(email, password)

    if (response.isSuccessful) {
      console.log('handleSignIn response', response.data)
      setAccount(Account.create(response.data))
      return true
    }

    toast.showError(response.errorMessage, 10)
    return false
  }

  async function handleSignOut() {
    const response = await authService.signOut()

    if (response.isFailure) {
      toast.showError(response.errorMessage, 4)

      return
    }

    router.goTo(ROUTES.auth.signIn)
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
    user: setUser(userDto),
    isLoading,
    handleSignIn,
    handleSignOut,
    updateUser,
    refetchUser: refetch,
    updateUserCache,
    notifyUserChanges,
  }
}
