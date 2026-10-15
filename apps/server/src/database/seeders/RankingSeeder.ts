import { ModuleSeeder } from './ModuleSeeder'
import type { SeedDatabase } from './SeedDatabase'

export class RankingSeeder extends ModuleSeeder {
  constructor(database: SeedDatabase) {
    super(database, ['tiers', 'ranking_users'])
  }
}
