import type { SupabaseProfileChannel } from '@/realtime/supabase/channels'

export type RealtimeContextValue = {
  profileChannel: ReturnType<typeof SupabaseProfileChannel>
}
