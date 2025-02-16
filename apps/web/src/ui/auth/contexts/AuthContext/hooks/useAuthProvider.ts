'use client'

import { useCallback, useEffect, useState } from 'react'

import type { UserDto } from '@stardust/core/global/dtos'
import { Observer } from '@stardust/core/global/structs'
import { User } from '@stardust/core/global/entities'

import { CACHE, DOM_EVENTS, ROUTES } from '@/constants'
import { useApi } from '@/ui/global/hooks/useApi'
import { useCache } from '@/ui/global/hooks/useCache'
import { useRouter } from '@/ui/global/hooks/useRouter'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import type { AuthContextValue } from '../types/AuthContextValue'
import type { Session } from '../types/Session'

export function useAuthProvider(serverSession: Session | null) {
  const [session, setSession] = useState<Session | null>(serverSession)
  const api = useApi()
  const router = useRouter()
  const toast = useToastContext()

  async function fetchUser() {
    const userId = session?.user?.id

    if (!userId) return

    const response = await api.fetchUserById(userId)

    if (response.isFailure) {
      toast.show(response.errorMessage)
      return
    }

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
    isEnabled: Boolean(session?.user?.id),
    dependencies: [session?.user.id],
  })

  const notifyUserChanges = useCallback(() => {
    const userChangeEvent = new Event(DOM_EVENTS.userChange)
    window.dispatchEvent(userChangeEvent)
  }, [])

  function setUser(userDto: UserDto | null) {
    if (!userDto) return null

    const user = User.create(userDto)
    user.observer = new Observer(notifyUserChanges)
    return user
  }

  async function handleSignIn(email: string, password: string) {
    const response = await api.signIn(email, password)

    if (response.isSuccess) {
      setSession({ user: { id: response.body.userId } })
      return true
    }

    toast.show(response.errorMessage, { type: 'error', seconds: 10 })
    return false
  }

  async function handleSignOut() {
    const response = await api.signOut()

    if (response.isFailure) {
      toast.show(response.errorMessage, {
        type: 'error',
        seconds: 4,
      })

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

  async function updateUser(user: User) {
    if (user?.id) {
      await api.updateUser(user)
      updateUserCache(user.dto)
    }
  }

  useEffect(() => {
    if (!session?.user.id) {
      updateUserCache(null)
      return
    }
  }, [session?.user.id, updateUserCache])

  const value: AuthContextValue = {
    user: setUser(userDto),
    isLoading,
    serverSession,
    handleSignIn,
    handleSignOut,
    updateUser,
    refetchUser: refetch,
    updateUserCache,
    notifyUserChanges,
  }

  return value
}
