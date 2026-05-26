'use client'

import { createContext, type PropsWithChildren } from 'react'

import { useProvisionContext } from '@/ui/global/hooks/useProvisionContext'

import type { RestContextValue } from './types/RestContextValue'
import { useRestContextProvider } from './useRestContextProvider'

export const RestContext = createContext({} as RestContextValue)

export const RestContextProvider = ({ children }: PropsWithChildren) => {
  const { signedFileStorageProvider } = useProvisionContext()
  const value = useRestContextProvider(signedFileStorageProvider)

  return <RestContext.Provider value={value}>{children}</RestContext.Provider>
}
