import type { SupabaseClient } from '@supabase/supabase-js'

export class SupabaseUsersRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async getUser(userId: string) {
    const { data, error, status } = await this.supabase
      .from('users')
      .select(
        `*, 
          avatar:avatars(*), 
          rocket:rockets(*), 
          tier:tiers(*),
          users_unlocked_stars(star_id),
          users_unlocked_achievements(achievement_id),
          users_rescuable_achievements(achievement_id),
          users_acquired_rockets(rocket_id),
          users_acquired_avatars(avatar_id),
          users_completed_challenges(challenge_id),
          users_upvoted_solutions(solution_id),
          users_upvoted_comments(comment_id)`,
      )
      .eq('id', userId)
      .single()
  }
}

// https://stardust-web-app-c9db624e9ebb.herokuapp.com/
