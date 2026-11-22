import { ModuleSeeder } from './ModuleSeeder'
import type { SeedDatabase } from './SeedDatabase'

export class ProfileSeeder extends ModuleSeeder {
  constructor(database: SeedDatabase) {
    super(database, [
      'achievements',
      'users',
      'notes',
      'users_acquired_avatars',
      'users_acquired_rockets',
      'users_acquired_insignias',
      'users_unlocked_achievements',
      'users_rescuable_achievements',
      'users_completed_stars',
      'users_opened_planets',
      'users_completed_challenges',
      'users_challenge_votes',
      'users_upvoted_solutions',
      'users_upvoted_comments',
    ])
  }
}
