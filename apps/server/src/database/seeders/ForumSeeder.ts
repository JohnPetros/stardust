import { ModuleSeeder } from './ModuleSeeder'
import type { SeedDatabase } from './SeedDatabase'

export class ForumSeeder extends ModuleSeeder {
  constructor(database: SeedDatabase) {
    super(database, ['comments', 'challenges_comments', 'solutions_comments'])
  }
}
