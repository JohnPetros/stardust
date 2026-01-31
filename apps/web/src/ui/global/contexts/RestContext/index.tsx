'use client'

import { createContext, type PropsWithChildren } from 'react'

import type { RestContextValue } from './types'
import { useRestContextProvider } from './useRestContextProvider'
import { useRestContext } from '../../hooks/useRestContext'

export const RestContext = createContext({} as RestContextValue)

export const RestContextProvider = ({ children }: PropsWithChildren) => {
  const value = useRestContextProvider()

  return <RestContext.Provider value={value}>{children}</RestContext.Provider>
}

export { useRestContext }
