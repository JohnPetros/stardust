'use client'

import { useCallback, useEffect, useState } from 'react'

import type { UserDto } from '@stardust/core/global/dtos'
import { Observer } from '@stardust/core/global/structs'
import { User } from '@stardust/core/global/entities'

import { CACHE, ROUTES } from '@/constants'
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
    mutate,
  } = useCache({
    key: CACHE.keys.authUser,
    fetcher: fetchUser,
    isEnabled: Boolean(session?.user?.id),
    dependencies: [session?.user.id],
  })

  function notifyUserChanges() {
    const userChangeEvent = new Event('userChange')
    window.dispatchEvent(userChangeEvent)
  }

  function setUser(userDto: UserDto | null) {
    if (!userDto) return null

    const user = User.create(userDto)
    user.observer = new Observer(notifyUserChanges)
    return user
  }

  async function handleSignIn(email: string, password: string) {
    const response = await api.signIn(email, password)

    if (response.isSuccess) {
      setSession({ user: { id: response.body } })
      return true
    }

    toast.show(response.errorMessage, { type: 'error', seconds: 10 })
    return false
  }

  async function handleSignUp(email: string, password: string, name: string) {
    const response = await api.signUp(email, password, name)

    if (response.isFailure) {
      toast.show(response.errorMessage, { type: 'error', seconds: 10 })
      return false
    }

    toast.show('Enviamos para você um e-mail de confirmação', {
      type: 'success',
      seconds: 10,
    })

    return true
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

  const mutateUserCache = useCallback(
    (userData: UserDto | null, shouldRevalidate = true) => {
      mutate(userData, {
        shouldRevalidate,
      })
    },
    [mutate],
  )

  async function updateUser(user: User) {
    if (user?.id) {
      await api.updateUser(user)
      mutateUserCache(user.dto)
    }
  }

  useEffect(() => {
    if (!session?.user.id) {
      mutateUserCache(null)
      return
    }
  }, [session?.user.id, mutateUserCache])

  const value: AuthContextValue = {
    user: setUser(userDto),
    isLoading,
    serverSession,
    handleSignIn,
    handleSignUp,
    handleSignOut,
    updateUser,
    mutateUserCache,
  }

  return value
}
