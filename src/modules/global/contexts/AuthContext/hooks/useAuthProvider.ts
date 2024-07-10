'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'

import type { AuthContextValue } from '../types/AuthContextValue'
import type { Session } from '../types/Session'
import { useToastContext } from '../../ToastContext'

import { User } from '@/@core/domain/entities'

import { useApi } from '@/infra/api'
import { useCache } from '@/infra/cache'

import { CACHE, ROUTES } from '@/modules/global/constants'

export function useAuthProvider(serverSession: Session | null) {
  const [session, setSession] = useState<Session | null>(serverSession)

  const api = useApi()
  const router = useRouter()
  const toast = useToastContext()

  async function fetchUser() {
    const userId = session?.user?.id

    if (userId) {
      const response = await api.getUserById(userId)

      return response.data.dto
    }
  }

  const {
    data: userDTO,
    error: fetchUserError,
    isLoading,
    mutate,
  } = useCache({
    key: CACHE.keys.authUser,
    fetcher: fetchUser,
    dependencies: [session?.user.id],
  })

  if (fetchUserError) console.error(fetchUserError)

  async function handleSignIn(email: string, password: string) {
    const response = await api.signIn(email, password)

    if (response.isSuccess) {
      setSession({ user: { id: response.data } })
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
    await api.signOut()

    router.push(ROUTES.public.signIn)
  }

  const mutateUserCache = useCallback(
    (user: User | null, shouldRevalidate = true) => {
      if (!user || session?.user.id) return

      mutate(user.dto, {
        shouldRevalidate,
      })
    },
    [session?.user.id, mutate]
  )

  async function updateUser(user: User) {
    if (user?.id) {
      await api.updateUser(user)
      mutateUserCache(user)
    }
  }

  useEffect(() => {
    if (!session?.user.id) {
      mutateUserCache(null)
      return
    }
  }, [session?.user.id, mutateUserCache])

  const value: AuthContextValue = {
    user: userDTO ? User.create(userDTO) : null,
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
