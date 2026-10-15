import { ModuleSeeder } from './ModuleSeeder'
import type { SeedDatabase } from './SeedDatabase'

export class ShopSeeder extends ModuleSeeder {
  constructor(database: SeedDatabase) {
    super(database, ['avatars', 'rockets', 'insignias'])
  }
}
