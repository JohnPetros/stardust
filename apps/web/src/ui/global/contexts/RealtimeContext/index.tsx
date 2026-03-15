'use client'

import { createContext, type PropsWithChildren } from 'react'

import type { RealtimeContextValue } from './types'
import { useRealtimeContextProvider } from './useRealtimeContextProvider'

export const RealtimeContext = createContext({} as RealtimeContextValue)

export const RealtimeContextProvider = ({ children }: PropsWithChildren) => {
  const contextValue = useRealtimeContextProvider()

  return (
    <RealtimeContext.Provider value={contextValue}>{children}</RealtimeContext.Provider>
  )
}
