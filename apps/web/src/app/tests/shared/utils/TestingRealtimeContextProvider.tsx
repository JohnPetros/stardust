'use client'

import type { PropsWithChildren } from 'react'
import { useEffect } from 'react'

import { RealtimeContextProvider } from '@/ui/global/contexts/RealtimeContext'
import { exposeProfileChannelMock, profileChannelMock } from './exposeProfileChannelMock'

export const TestingRealtimeContextProvider = ({ children }: PropsWithChildren) => {
  useEffect(() => {
    exposeProfileChannelMock()
  }, [])

  return (
    <RealtimeContextProvider profileChannel={profileChannelMock}>
      {children}
    </RealtimeContextProvider>
  )
}
