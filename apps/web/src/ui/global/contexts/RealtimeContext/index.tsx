'use client'

import type { ProfileChannel } from '@stardust/core/profile/interfaces'
import { createContext, type PropsWithChildren } from 'react'

import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { useRestContext } from '@/ui/global/hooks/useRestContext'
import type { RealtimeContextValue } from './types'
import { useRealtimeContextProvider } from './useRealtimeContextProvider'

export const RealtimeContext = createContext({} as RealtimeContextValue)

type Props = PropsWithChildren<{
  profileChannel?: ProfileChannel
}>

export const RealtimeContextProvider = ({ children, profileChannel }: Props) => {
  const { profileService } = useRestContext()
  const auth = useAuthContext()
  const value = useRealtimeContextProvider({ profileChannel, profileService, ...auth })

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
}
