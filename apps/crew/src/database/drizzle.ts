import { existsSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { AppError } from '@/errors/app-error'
import { sql } from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

import * as schema from '@/database/schema'

const HEALTH_CHECK_TIMEOUT_MS = 2_000

type MigrationsLocations = {
  entryDirectory: string
  workingDirectory: string
}

function hasMigrationJournal(folder: string): boolean {
  return existsSync(join(folder, 'meta', '_journal.json'))
}

export function resolveMigrationsFolder({
  entryDirectory = dirname(fileURLToPath(import.meta.url)),
  workingDirectory = process.cwd(),
}: Partial<MigrationsLocations> = {}): string {
  const searched = [join(entryDirectory, 'migrations')]

  for (
    let directory = workingDirectory;
    dirname(directory) !== directory;
    directory = dirname(directory)
  ) {
    searched.push(join(directory, 'src', 'database', 'migrations'))
  }

  const found = searched.find(hasMigrationJournal)

  if (found) return found

  throw new AppError(
    `Pasta de migrations não encontrada. Locais procurados: ${searched.join(', ')}.`,
    'Erro de Configuração',
    { code: 'migrations_not_found' },
  )
}

function createDrizzle(client: postgres.Sql) {
  return drizzle(client, { schema, casing: 'snake_case' })
}

export class CrewDatabase {
  readonly drizzle: ReturnType<typeof createDrizzle>
  private readonly client: postgres.Sql

  constructor(databaseUrl: string) {
    this.client = postgres(databaseUrl, {
      max: 5,
      prepare: false,
      connect_timeout: 12,
      idle_timeout: 10,
      onnotice: () => {},
    })
    this.drizzle = createDrizzle(this.client)
  }

  async migrate(migrationsFolder: string): Promise<void> {
    await migrate(this.drizzle, {
      migrationsFolder: resolve(process.cwd(), migrationsFolder),
      migrationsSchema: 'crew',
      migrationsTable: '__drizzle_migrations',
    })
  }

  async isHealthy(): Promise<boolean> {
    let timer: NodeJS.Timeout | undefined
    const timeout = new Promise<false>((resolveTimeout) => {
      timer = setTimeout(() => resolveTimeout(false), HEALTH_CHECK_TIMEOUT_MS)
    })

    try {
      const check = this.drizzle.execute(sql`select 1`).then(
        () => true as const,
        () => false as const,
      )
      return await Promise.race([check, timeout])
    } finally {
      clearTimeout(timer)
    }
  }

  async close(): Promise<void> {
    await this.client.end({ timeout: 5 })
  }
}
