'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AuthError, Session } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import useSWR, { mutate } from 'swr'

import type { User } from '@/@types/user'
import { useApi } from '@/services/api'

export type OAuthProvider = 'github'

export interface AuthContextValue {
  user: User | null
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
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>
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
    error: fetchUserError,
    isLoading,
  } = useSWR(
    () => (session?.user.id ? `/user?session_id=${session?.user.id}` : null),
    getUser
  )

  console.log({ user })

  async function signIn(email: string, password: string) {
    const { session, error } = await api.signIn(email, password)

    if (error) {
      return error
    }

    setSession(session)

    return null
  }

  if (fetchUserError) console.error(fetchUserError)

  async function signUp(email: string, password: string) {
    return await api.signUp(email, password)
  }

  async function signInWithOAuth(oauthProvider: OAuthProvider) {
    switch (oauthProvider) {
      case 'github':
        await api.githubOAuth()
        break
      default:
    }
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
      mutate(
        `/user?session_id=${session?.user.id}`,
        { ...user, ...newData },
        {
          revalidate: true,
        }
      )
    }
  }

  useEffect(() => {
    if (!session?.user.id) {
      mutate('/user', null, false)
      return
    }
  }, [session])

  // useEffect(() => {
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange((event, session) => {
  //     console.log({ supabaseSession: session })
  //     console.log(serverSession?.refresh_token)
  //     console.log(serverSession?.access_token)
  //   })

  //   return () => {
  //     subscription.unsubscribe()
  //   }
  // }, [supabase, serverSession?.refresh_token, serverSession?.access_token])

  const value: AuthContextValue = {
    user: user ?? null,
    isLoading,
    signIn,
    signUp,
    signOut,
    signInWithOAuth,
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
