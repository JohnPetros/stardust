'use client'

import { createContext, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '../hooks/useSupabase'
import useSWR from "swr";

import { Session } from '@supabase/supabase-js'
import { User } from '@/types/collections'

interface AuthContextValue {
  user: User | null
  error: any
  isLoading: boolean
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<string | null>
}

interface AuthProviderProps {
  serverSession?: Session | null
  children: React.ReactNode
}

export const AuthContext = createContext({} as AuthContextValue)

export function AuthProvider({ serverSession, children }: AuthProviderProps) {
  const { supabase } = useSupabase()
  const router = useRouter()

  const getUser = async () => {
    const { data: user, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', serverSession?.user?.id)
      .single()
    if (error) {
      console.log(error)
      return null
    } else {
      return user
    }
  }

  const {
    data: user,
    error,
    isLoading,
  } = useSWR(serverSession ? 'profile-context' : null, getUser)

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/sign-in')
  }

  const signIn = async (email: string, password: string) => {
    console.log(email, password);
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    console.log(error);
    
    if (error) {
      return error.message
    }

    return null
  }

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.access_token !== serverSession?.access_token) {
        router.refresh()
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
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
