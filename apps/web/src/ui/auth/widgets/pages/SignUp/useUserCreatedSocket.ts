import { useEffect } from 'react'

import { UserCreatedEvent } from '@stardust/core/profile/events'

import { useSupabaseContext } from '@/ui/global/contexts/SupabaseContext/hooks'

export function useUserCreatedSocket(onCreateUser: (event: UserCreatedEvent) => void) {
  const { supabase } = useSupabaseContext()

  useEffect(() => {
    const channel = supabase
      .channel('user.created.channel')
      .on(
        // @ts-ignore
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'users' },
        (payload: { new: { id: string } }) => {
          const event = new UserCreatedEvent({ userId: payload.new.id })
          onCreateUser(event)
        },
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [supabase, onCreateUser])
}
