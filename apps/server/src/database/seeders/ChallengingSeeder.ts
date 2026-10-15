import { ModuleSeeder } from './ModuleSeeder'
import type { SeedDatabase } from './SeedDatabase'

export class ChallengingSeeder extends ModuleSeeder {
  constructor(database: SeedDatabase) {
    super(database, [
      'categories',
      'challenges',
      'challenges_categories',
      'challenge_sources',
      'solutions',
      'challenge_code_executions',
    ])
  }
}
