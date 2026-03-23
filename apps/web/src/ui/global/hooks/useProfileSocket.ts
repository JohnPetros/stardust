'use client'

import { useEffect } from 'react'

import type { UserCreatedEvent } from '@stardust/core/profile/events'

import { useRealtimeContext } from './useRealtimeContext'

export function useProfileSocket(onCreateUser: (event: UserCreatedEvent) => void) {
  const { profileChannel } = useRealtimeContext()

  useEffect(() => {
    return profileChannel.onCreateUser(onCreateUser)
  }, [onCreateUser])
}
