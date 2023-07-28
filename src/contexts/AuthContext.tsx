'use client'

import { createContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../hooks/useSupabase'
import useSWR from 'swr'
import { mutate } from 'swr'

import { AuthError, Session } from '@supabase/supabase-js'
import { api } from '@/services/api'
import { User } from '@/types/user'
import { ROCKET_ANIMATION_DURATION } from '@/utils/constants'

interface AuthContextValue {
  user: User | null | undefined
  error: any
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
  updateUser: (newData: Partial<User>) => Promise<string | null>
}

interface AuthProviderProps {
  serverSession?: Session | null
  children: React.ReactNode
}

export const AuthContext = createContext({} as AuthContextValue)

export function AuthProvider({ serverSession, children }: AuthProviderProps) {
  const { supabase } = useSupabase()
  const router = useRouter()

  async function getUser() {
    const userId = serverSession?.user?.id

    if (userId) {
      return await api.getUser(userId)
    }
  }

  const {
    data: user,
    error,
    isLoading,
  } = useSWR(serverSession ? '/user' : null, getUser)

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return error.message
    }

    return null
  }

  async function signUp(email: string, password: string) {
    const { data: response, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      return { userId: null, error }
    }

    if (response.user) return { userId: response.user.id, error: null }

    return null
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return error.message
    }

    router.push('/sign-in')

    return null
  }

  async function updateUser(newData: Partial<User>): Promise<string | null> {
    if (user?.id) {
      await api.updateUser(newData, user.id)

      if (error) {
        return error
      }

      mutate('/user', { ...user, ...newData }, false)
      return null
    }
    return null
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverSession?.access_token) {
        setTimeout(() => {
          router.refresh()
        }, ROCKET_ANIMATION_DURATION * 1000 * 3)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router, supabase, serverSession?.access_token])

  const value: AuthContextValue = {
    user,
    error,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
