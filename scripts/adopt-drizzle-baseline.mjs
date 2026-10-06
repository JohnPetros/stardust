import {
  withTransitionSession,
  loadTransitionManifest,
  inspectTransition,
  transitionMigrations,
  parseTransitionCli,
  transitionUsage,
  runTransitionCli,
  isMain,
} from './check-drizzle-transition.mjs'

/** @param {import('./check-drizzle-transition.mjs').TransitionOptions} options */
export async function adoptBaseline(options) {
  const manifest = loadTransitionManifest(options.manifestPath)
  return withTransitionSession(options, async (client, assertSession) => {
    await client.unsafe('BEGIN')
    try {
      const result = await inspectTransition(client, manifest, options.phase)
      if (!result.compatible)
        throw new Error('Database is incompatible with baseline adoption')
      if (options.phase !== 'legacy') {
        await client.unsafe('COMMIT')
        return { adopted: false }
      }
      await assertSession()
      await client.unsafe('CREATE SCHEMA IF NOT EXISTS drizzle')
      await client.unsafe(
        'CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (id SERIAL PRIMARY KEY, hash text NOT NULL, created_at bigint)',
      )
      for (const migration of transitionMigrations().slice(0, 2))
        await client`INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES (${migration.hash}, ${migration.folderMillis})`
      await assertSession()
      await client.unsafe('COMMIT')
      return { adopted: true }
    } catch (error) {
      await client.unsafe('ROLLBACK').catch(() => {})
      throw error
    }
  })
}
if (isMain(import.meta.url)) {
  runTransitionCli(async () => {
    const parsed = parseTransitionCli()
    if (parsed.help) {
      console.log(transitionUsage())
      return
    }
    console.log(JSON.stringify(await adoptBaseline(parsed.options)))
  })
}
