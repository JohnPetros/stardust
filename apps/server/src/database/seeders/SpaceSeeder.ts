import { ModuleSeeder } from './ModuleSeeder'
import type { SeedDatabase } from './SeedDatabase'

export class SpaceSeeder extends ModuleSeeder {
  constructor(database: SeedDatabase) {
    super(database, ['planets', 'stars'])
  }
}
