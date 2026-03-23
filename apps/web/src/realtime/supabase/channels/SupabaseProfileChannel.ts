import type { SupabaseClient } from '@supabase/supabase-js'

import { UserCreatedEvent } from '@stardust/core/profile/events'
import type { ProfileChannel } from '@stardust/core/profile/interfaces'
import type { SupabaseUser } from '../types'
import { Name } from '@stardust/core/global/structures'

export function SupabaseProfileChannel(supabase: SupabaseClient): ProfileChannel {
  return {
    onCreateUser(listener: (event: UserCreatedEvent) => void) {
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
              userSlug: Name.create(payload.new.name).slug.value,
            })
            listener(event)
          },
        )
        .subscribe()
      return () => {
        channel.unsubscribe()
      }
    },
  }
}
