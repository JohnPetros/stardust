import { useEffect } from 'react'

import { UserCreatedEvent } from '@stardust/core/profile/events'

import { SupabaseClient } from '@/realtime/supabase/client'
import type { SupabaseUser } from '@/realtime/types'

export function useProfileSocket(onCreateUser: (event: UserCreatedEvent) => void) {
  useEffect(() => {
    const supabase = SupabaseClient()

    const channel = supabase
      .channel('user.created.channel')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'users' },
        (payload: { new: SupabaseUser }) => {
          const event = new UserCreatedEvent({
            userId: payload.new.id,
            userName: payload.new.name,
            userEmail: payload.new.email,
          })
          onCreateUser(event)
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [onCreateUser])
}
