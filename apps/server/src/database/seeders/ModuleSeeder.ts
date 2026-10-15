import type { SeedDatabase, SeedRow } from './SeedDatabase'

export type ModuleSeed = Record<string, readonly SeedRow[]>

export class ModuleSeeder {
  constructor(
    protected readonly database: SeedDatabase,
    private readonly tables: readonly string[],
  ) {}

  async clear(): Promise<void> {
    await this.database.clear([...this.tables].reverse())
  }

  async run(seed: ModuleSeed): Promise<void> {
    for (const table of this.tables) {
      await this.database.insert(table, seed[table] ?? [])
    }
  }
}
