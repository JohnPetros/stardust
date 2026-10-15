import { ModuleSeeder } from './ModuleSeeder'
import type { SeedDatabase } from './SeedDatabase'

export class PlaygroundSeeder extends ModuleSeeder {
  constructor(database: SeedDatabase) {
    super(database, ['snippets'])
  }
}
