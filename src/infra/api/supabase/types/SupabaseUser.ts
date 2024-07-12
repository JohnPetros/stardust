import type { Database } from './Database'

export type SupabaseUser = Database['public']['Tables']['users']['Row'] & {
  users_unlocked_stars?: { star_id: string }[]
  users_unlocked_achievements?: { achievement_id: string }[]
  users_rescuable_achievements?: { achievement_id: string }[]
  users_acquired_rockets?: { rocket_id: string }[]
  users_acquired_avatars?: { avatar_id: string }[]
  users_completed_challenges?: { challenge_id: string }[]
}
