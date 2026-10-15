import { ModuleSeeder } from './ModuleSeeder'
import type { SeedDatabase } from './SeedDatabase'

export class ManualSeeder extends ModuleSeeder {
  constructor(database: SeedDatabase) {
    super(database, ['guides'])
  }
}
