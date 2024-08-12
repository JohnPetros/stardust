'use client'

import { createContext, type ReactNode } from 'react'

import type { Session, AuthContextValue } from './types'
import { useAuthProvider, useAuthContext } from './hooks'

type AuthProviderProps = {
  serverSession: Session | null
  children: ReactNode
}

export const AuthContext = createContext({} as AuthContextValue)

export function AuthProvider({ serverSession, children }: AuthProviderProps) {
  const authContextValue = useAuthProvider(serverSession)

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}

export { useAuthContext }
