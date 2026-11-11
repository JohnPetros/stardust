'use client'

import { useEffect, useRef } from 'react'

import type { UserCreatedEvent } from '@stardust/core/profile/events'

import { useRealtimeContext } from './useRealtimeContext'

type Listener = (event: UserCreatedEvent) => void

export function useProfileSocket(
  onCreateUser: Listener,
  options?: { enabled?: boolean },
) {
  const { profileChannel } = useRealtimeContext()
  const listenerRef = useRef(onCreateUser)
  listenerRef.current = onCreateUser

  useEffect(() => {
    if (options?.enabled === false) return
    return profileChannel.onCreateUser((event) => listenerRef.current(event))
  }, [options?.enabled, profileChannel])
}
