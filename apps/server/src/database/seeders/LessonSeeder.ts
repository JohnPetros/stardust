import { ModuleSeeder, type ModuleSeed } from './ModuleSeeder'
import type { SeedDatabase } from './SeedDatabase'

export class LessonSeeder extends ModuleSeeder {
  constructor(database: SeedDatabase) {
    super(database, ['questions'])
  }

  async run(seed: ModuleSeed): Promise<void> {
    await super.run(seed)
    for (const star of seed.stars ?? []) {
      await this.database.update('stars', 'id', star)
    }
  }
}
