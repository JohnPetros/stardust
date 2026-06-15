'use client'

import type { ProfileChannel } from '@stardust/core/profile/interfaces'
import { createContext, type PropsWithChildren } from 'react'

import type { RealtimeContextValue } from './types'
import { useRealtimeContextProvider } from './useRealtimeContextProvider'

export const RealtimeContext = createContext({} as RealtimeContextValue)

type Props = PropsWithChildren<{
  profileChannel?: ProfileChannel
}>

export const RealtimeContextProvider = ({ children, profileChannel }: Props) => {
  const contextValue = useRealtimeContextProvider(profileChannel)

  return (
    <RealtimeContext.Provider value={contextValue}>{children}</RealtimeContext.Provider>
  )
}
