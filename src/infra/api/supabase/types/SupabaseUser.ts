import type { Database } from './Database'
import type { SupabaseAvatar } from './SupabaseAvatar'
import type { SupabaseRanking } from './SupabaseRanking'
import type { SupabaseRocket } from './SupabaseRocket'

export type SupabaseUser = Database['public']['Tables']['users']['Row'] & {
  avatars?: SupabaseAvatar | null
  rockets?: SupabaseRocket | null
  rankings?: SupabaseRanking | null
  users_unlocked_stars?: { star_id: string }[]
  users_unlocked_achievements?: { achievement_id: string }[]
  users_rescuable_achievements?: { achievement_id: string }[]
  users_acquired_rockets?: { rocket_id: string }[]
  users_acquired_avatars?: { avatar_id: string }[]
  users_completed_challenges?: { challenge_id: string }[]
}
