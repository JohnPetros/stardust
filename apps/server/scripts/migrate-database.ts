import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import {
  withTransitionSession,
  loadTransitionManifest,
  inspectTransition,
  readTransitionLedger,
  inspectEmptyApplication,
  transitionMigrations,
  migrationsFolder,
  projectRoot,
  cliOptions,
  parseTransitionCli,
  transitionUsage,
  runTransitionCli,
  isMain,
} from '../../../scripts/check-drizzle-transition.mjs'

export async function migrateDatabase(
  options = cliOptions(),
  rollback = false,
): Promise<void> {
  const manifest = loadTransitionManifest(options.manifestPath)
  await withTransitionSession(options, async (client, assertSession) => {
    const ledger = await readTransitionLedger(client)
    if (rollback) {
      const phase = ledger.length === 2 ? 'adopted' : 'server-owned'
      const result = await inspectTransition(client, manifest, phase)
      if (!result.compatible)
        throw new Error('Database is incompatible with access rollback')
      if (phase === 'adopted') return
      const path = resolve(
        projectRoot,
        'apps/server/src/database/drizzle/rollback/0002_server_owned_access.sql',
      )
      const inverse = readFileSync(path, 'utf8')
      if (
        createHash('sha256').update(inverse).digest('hex') !==
        '6254d526ff5e66f72b2f1726007ea4babb8c21ed24b2102171600655b40f0c19'
      )
        throw new Error('Rollback migration hash differs')
      await client.unsafe('BEGIN')
      try {
        await assertSession()
        for (const statement of inverse.split('--> statement-breakpoint'))
          await client.unsafe(statement)
        const migration = transitionMigrations()[2]
        await client`DELETE FROM drizzle.__drizzle_migrations WHERE hash = ${migration.hash} AND created_at = ${migration.folderMillis}`
        const restored = await inspectTransition(client, manifest, 'adopted')
        if (!restored.compatible)
          throw new Error('Restored catalog differs from adopted state')
        await assertSession()
        await client.unsafe('COMMIT')
      } catch (error) {
        await client.unsafe('ROLLBACK').catch(() => {})
        throw error
      }
      return
    }
    if (ledger.length === 0) {
      const differences = await inspectEmptyApplication(client, manifest)
      if (differences.length > 0)
        throw new Error(
          `Nonempty database requires verified baseline adoption (${differences.join(', ')})`,
        )
    } else {
      const phase = ledger.length === 2 ? 'adopted' : 'server-owned'
      const result = await inspectTransition(client, manifest, phase)
      if (!result.compatible) throw new Error('Database is incompatible with migration')
      if (phase === 'server-owned') return
    }
    await assertSession()
    await client.unsafe('SET search_path TO public, extensions')
    await migrate(drizzle(client), {
      migrationsFolder,
      migrationsSchema: 'drizzle',
      migrationsTable: '__drizzle_migrations',
    })
    await assertSession()
    const result = await inspectTransition(client, manifest, 'server-owned')
    if (!result.compatible)
      throw new Error('Migrated catalog differs from server-owned state')
  })
}
if (isMain(import.meta.url)) {
  runTransitionCli(async () => {
    const parsed = parseTransitionCli(process.argv.slice(2), { allowRollback: true })
    if (parsed.help) {
      console.log(transitionUsage(true))
      return
    }
    await migrateDatabase(parsed.options, parsed.rollback)
  })
}
