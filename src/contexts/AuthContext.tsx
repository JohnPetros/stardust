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
  signIn: (email: string, password: string) => Promise<void>
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
  signOut: () => Promise<void>
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>
  updateUser: (newUserData: Partial<User>) => Promise<void>
  serverSession: Session | null
}

interface AuthProviderProps {
  serverSession: Session | null
  children: React.ReactNode
}

export const AuthContext = createContext({} as AuthContextValue)

export function AuthProvider({ serverSession, children }: AuthProviderProps) {
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

  async function signIn(email: string, password: string) {
    try {
      const session = await api.signIn(email, password)
      setSession(session)
    } catch (error) {
      console.error(error)
      throw new Error()
    }
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
    await api.signOut()

    router.push('/sign-in')
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

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
