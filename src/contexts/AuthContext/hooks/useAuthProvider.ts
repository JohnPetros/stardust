'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import useSWR, { mutate } from 'swr'

import type { AuthContextValue } from '../types/AuthContextValue'
import type { OAuthProvider } from '../types/OAuthProvider'
import type { Session } from '../types/Session'

import type { User } from '@/@types/User'
import { useApi } from '@/services/api'

export function useAuthProvider(serverSession: Session | null) {
  const [session, setSession] = useState<Session | null>(serverSession)
  const api = useApi()
  const router = useRouter()

  async function getUser() {
    const userId = session?.user?.id

    if (userId) {
      return await api.getUserById(userId)
    }
  }

  const {
    data: user,
    error: fetchUserError,
    isLoading,
  } = useSWR(
    () => (session?.user.id ? `/user?session_id=${session?.user.id}` : null),
    getUser
  )

  if (fetchUserError) console.error(fetchUserError)

  async function signIn(email: string, password: string) {
    try {
      const session = await api.signIn(email, password)
      setSession(session)
    } catch (error) {
      console.error(error)
      throw new Error()
    }
  }

  async function signUp(email: string, password: string) {
    return await api.signUp(email, password)
  }

  async function signInWithOAuth(oauthProvider: OAuthProvider) {
    switch (oauthProvider) {
      case 'github':
        await api.signInWithGithubOAuth()
        break
      default:
    }
  }

  async function signOut() {
    await api.signOut()

    router.push('/sign-in')
  }

  const mutateUserCache = useCallback(
    (newData: Partial<User> | null, shouldRevalidate = true) => {
      console.log({ newData })
      mutate(
        `/user?session_id=${session?.user.id}`,
        { ...user, ...newData },
        {
          revalidate: shouldRevalidate,
        }
      )
    },
    [session?.user.id, user]
  )

  async function updateUser(newData: Partial<User>) {
    if (user?.id) {
      await api.updateUser(newData, user.id)
      mutateUserCache(newData)
    }
  }

  useEffect(() => {
    if (!session?.user.id) {
      mutateUserCache(null)
      return
    }
  }, [session?.user.id, mutateUserCache])

  const value: AuthContextValue = {
    user: user ?? null,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
    updateUser,
    mutateUserCache,
    serverSession,
  }

  return value
}
