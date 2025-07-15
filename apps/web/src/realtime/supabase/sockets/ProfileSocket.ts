import { UserCreatedEvent } from '@stardust/core/profile/events'
import { SupabaseClient } from '../client'

export const ProfileSocket = async () => {
  const supabase = SupabaseClient()

  return {
    onUserCreated(callback: (event: UserCreatedEvent) => void) {
      const channel = supabase
        .channel('profile.channel')
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'profiles' },
          (payload) => {
            const event = new UserCreatedEvent({
              userId: payload.new.id,
              userName: payload.new.name,
              userEmail: payload.new.email,
            })
            callback(event)
          },
        )
    },
  }
}
