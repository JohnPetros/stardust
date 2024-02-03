'use client'

import { createContext, ReactNode } from 'react'
import { Session } from '@supabase/supabase-js'

import { useAuthProvider } from './hooks/useAuthProvider'
import { AuthContextValue } from './types/authContextValue'

type AuthProviderProps = {
  serverSession: Session | null
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextValue)

export function AuthProvider({ serverSession, children }: AuthProviderProps) {
  const authContextValue = useAuthProvider(serverSession)

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  )
}
