'use client'

import { createContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../hooks/useSupabase'
import useSWR, { mutate } from 'swr'

import { AuthError, Session } from '@supabase/supabase-js'
import { api } from '@/services/api'
import { User } from '@/types/user'

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
  const { supabase } = useSupabase()
  const router = useRouter()

  async function getUser() {
    const userId = session?.user?.id

    if (userId) {
      return await api.getUser(userId)
    }
  }

  const {
    data: user,
    error,
    isLoading,
  } = useSWR(session?.user.id ? '/user' : null, getUser)

  async function signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return error.message
    }

    setSession(data.session)

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
      const error = await api.updateUser(newData, user.id)

      if (error) {
        return error
      }

      mutate('/user', { ...user, ...newData }, false)

      return null
    }
    return null
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
    user,
    error,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateUser,
    serverSession,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
