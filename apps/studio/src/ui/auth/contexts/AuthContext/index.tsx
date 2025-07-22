import { createContext, type PropsWithChildren } from 'react'

import { useRest } from '@/ui/global/hooks/useRest'
import { useAuthContextProvider } from './useAuthContextProvider'
import type { AuthContextValue } from './AuthContextValue'

export const AuthContext = createContext({} as AuthContextValue)

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const { authService } = useRest()
  const authContextValue = useAuthContextProvider({
    authService,
  })

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>
}
