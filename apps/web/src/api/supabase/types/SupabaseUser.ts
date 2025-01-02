import type { Database } from './Database'
import type { SupabaseAvatar } from './SupabaseAvatar'
import type { SupabaseRocket } from './SupabaseRocket'
import type { SupabaseTier } from './SupabaseTier'

export type SupabaseUser = Database['public']['Tables']['users']['Row'] & {
  avatar?: SupabaseAvatar | null
  rocket?: SupabaseRocket | null
  tier?: SupabaseTier | null
  users_unlocked_stars?: { star_id: string }[]
  users_unlocked_achievements?: { achievement_id: string }[]
  users_rescuable_achievements?: { achievement_id: string }[]
  users_acquired_rockets?: { rocket_id: string }[]
  users_acquired_avatars?: { avatar_id: string }[]
  users_completed_challenges?: { challenge_id: string }[]
  users_upvoted_comments?: { comment_id: string }[]
}
