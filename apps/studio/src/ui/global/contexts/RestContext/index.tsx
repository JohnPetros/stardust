import { createContext, type PropsWithChildren } from 'react'
import type { RestContextValue } from './types/RestContextValue'
import { useRestProvider } from './useRestContextProvider'
import { useRestContext } from '../../hooks/useRestContext'

export const RestContext = createContext({} as RestContextValue)

export const RestContextProvider = ({ children }: PropsWithChildren) => {
  const value = useRestProvider()

  return <RestContext.Provider value={value}>{children}</RestContext.Provider>
}

export { useRestContext }
