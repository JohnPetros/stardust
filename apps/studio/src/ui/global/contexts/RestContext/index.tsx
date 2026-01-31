'use client'

import { createContext, type PropsWithChildren } from 'react'
import type { RestContextValue } from './types/RestContextValue'
import { useRestContextProvider } from './useRestContextProvider'

export const RestContext = createContext({} as RestContextValue)

export const RestContextProvider = ({ children }: PropsWithChildren) => {
  const value = useRestContextProvider()

  return <RestContext.Provider value={value}>{children}</RestContext.Provider>
}
