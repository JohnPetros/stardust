'use client'

import { createContext, type PropsWithChildren } from 'react'

import type { RealtimeContextValue } from './types'
import { useRealtimeContextProvider } from './useRealtimeContextProvider'

export const RealtimeContext = createContext({} as RealtimeContextValue)

export const RealtimeContextProvider = ({ children }: PropsWithChildren) => {
  const value = useRealtimeContextProvider()

  console.log('RealtimeContextProvider', value)

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
}
