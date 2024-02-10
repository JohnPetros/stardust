'use client'

import { createContext, ReactNode } from 'react'

import { useAuthProvider } from './hooks/useAuthProvider'
import type { AuthContextValue } from './types/AuthContextValue'
import type { Session } from './types/Session'

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
