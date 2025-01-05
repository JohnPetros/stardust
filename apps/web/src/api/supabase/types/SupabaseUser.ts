import type { Database } from './Database'
import type { SupabaseAvatar } from './SupabaseAvatar'
import type { SupabaseRocket } from './SupabaseRocket'
import type { SupabaseTier } from './SupabaseTier'

export type SupabaseUser = Database['public']['Views']['users_view']['Row'] & {
  avatar?: SupabaseAvatar | null
  rocket?: SupabaseRocket | null
  tier?: SupabaseTier | null
}
