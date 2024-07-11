import type { Database } from './Database'
import type { SupabaseAvatar } from './SupabaseAvatar'
import type { SupabaseRanking } from './SupabaseRanking'
import type { SupabaseRocket } from './SupabaseRocket'

export type SupabaseUser = Database['public']['Views']['users_view']['Row'] & {
  rocket?: SupabaseRocket
  avatar?: SupabaseAvatar
  ranking?: SupabaseRanking
}
