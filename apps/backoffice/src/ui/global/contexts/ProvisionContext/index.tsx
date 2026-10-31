'use client'

import { createContext, type PropsWithChildren } from 'react'

import type { ProvisionContextValue } from './types/ProvisionContextValue'
import { useProvisionContextProvider } from './useProvisionContextProvider'

export const ProvisionContext = createContext({} as ProvisionContextValue)

export const ProvisionContextProvider = ({ children }: PropsWithChildren) => {
  const value = useProvisionContextProvider()

  return <ProvisionContext.Provider value={value}>{children}</ProvisionContext.Provider>
}
