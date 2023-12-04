'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AuthError, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import useSWR, { mutate } from 'swr'

import type { User } from '@/@types/user'
import { useApi } from '@/services/api'

export interface AuthContextValue {
  user: User | null
  error: unknown
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (
    email: string,
    password: string
  ) => Promise<
    | {
        userId: null
        error: AuthError
      }
    | {
        userId: string
        error: null
      }
    | null
  >
  signOut: () => Promise<string | null>
  fetchUser: () => Promise<void>
  updateUser: (newUserData: Partial<User>) => Promise<void>
  serverSession: Session | null | undefined
}

interface AuthProviderProps {
  serverSession?: Session | null
  children: React.ReactNode
}

export const AuthContext = createContext({} as AuthContextValue)

export function AuthProvider({ serverSession, children }: AuthProviderProps) {
  const [session, setSession] = useState<Session | null | undefined>(
    serverSession
  )
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
    error,
    isLoading,
  } = useSWR(() => (session?.user.id ? '/user' : null), getUser)

  async function signIn(email: string, password: string) {
    const { session, error } = await api.signIn(email, password)

    if (error) {
      return error
    }

    setSession(session)

    return null
  }

  async function fetchUser() {
    const userId = await api.getAuthUserId()

    if (userId) {
      const user = await api.getUserById(userId)
      mutate('/user', user, false)
    }
  }

  async function signUp(email: string, password: string) {
    return await api.signUp(email, password)
  }

  async function signOut() {
    const error = await api.signOut()

    if (error) return error

    router.push('/sign-in')

    return null
  }

  async function updateUser(newData: Partial<User>) {
    if (user?.id) {
      await api.updateUser(newData, user.id)
      mutate('/user', { ...user, ...newData }, false)
    }
  }

  useEffect(() => {
    if (!session?.user.id) {
      mutate('/user', null, false)
    }
  }, [session])

  // useEffect(() => {
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((event, session) => {
  //     console.log(serverSession?.refresh_token)
  //     console.log(serverSession?.access_token)

  //     if (session?.access_token !== serverSession?.access_token) {
  //       // setTimeout(() => {
  //       const isPublicRoute = checkIsPublicRoute(pathname)

  //       if (!isPublicRoute) {
  //         router.refresh()
  //       } else {
  //       }
  //       // }, ROCKET_ANIMATION_DURATION * 1000 + 3000)
  //     }
  //   })

  //   return () => {
  //     subscription.unsubscribe()
  //   }
  // }, [supabase, serverSession?.access_token])

  const value: AuthContextValue = {
    user: user ?? null,
    error,
    isLoading,
    signIn,
    signUp,
    signOut,
    fetchUser,
    updateUser,
    serverSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
