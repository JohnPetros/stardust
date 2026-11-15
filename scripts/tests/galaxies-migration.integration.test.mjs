import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import postgres from 'postgres'

const enabled = process.env.STARDUST_LOCAL_MIGRATION_TEST === '1'
const migrationsDirectory = fileURLToPath(
  new URL('../../apps/server/src/database/drizzle/migrations/', import.meta.url),
)
const LOGICA_ID = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01'
const OBJECTS_ID = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a02'

function readMigration(name) {
  return readFileSync(`${migrationsDirectory}${name}.sql`, 'utf8')
}

function readStatements(name) {
  return readMigration(name)
    .split('--> statement-breakpoint')
    .map((statement) => statement.trim())
    .filter((statement) => statement.replace(/^--.*$/gm, '').trim().length > 0)
}

function readInverseStatements() {
  return readMigration('0004_galaxies_catalog')
    .split(/\r?\n/)
    .filter((line) => line.startsWith('-- inverse> '))
    .map((line) => line.slice('-- inverse> '.length).trim())
}

async function snapshotLegacyRows(sql) {
  const [snapshot] = await sql.unsafe(`
    SELECT
      (SELECT coalesce(jsonb_agg(to_jsonb(t) - 'current_galaxy_id' ORDER BY id), '[]') FROM public.users t)::text AS users,
      (SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY to_jsonb(t)::text), '[]') FROM public.users_unlocked_stars t)::text AS unlocked,
      (SELECT coalesce(jsonb_agg(to_jsonb(t) ORDER BY to_jsonb(t)::text), '[]') FROM public.users_recently_unlocked_stars t)::text AS recent`)
  return snapshot
}

test('galaxies migrations backfill legacy planets, keep user rows and lock the catalog down', {
  skip: !enabled,
}, async () => {
  const url = new URL(process.env.DATABASE_URL)
  assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))
  assert.equal(url.pathname, '/postgres')
  const pool = postgres(url.toString(), { max: 1, onnotice: () => {} })
  const sql = await pool.reserve()
  try {
    await sql.unsafe('BEGIN')

    // The documented inverse SQL must be executable and return to the 0002 schema.
    const inverse = readInverseStatements()
    assert.ok(inverse.length > 0, 'inverse SQL is documented in 0004_galaxies_catalog')
    for (const statement of inverse) await sql.unsafe(statement)
    const [remaining] = await sql.unsafe(`
      SELECT to_regclass('public.galaxies') IS NULL AS no_table,
        to_regtype('public.galaxy_status') IS NULL AS no_type,
        NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND ((table_name = 'planets' AND column_name = 'galaxy_id') OR (table_name = 'users' AND column_name = 'current_galaxy_id'))) AS no_columns`)
    assert.deepEqual(remaining, { no_table: true, no_type: true, no_columns: true })

    // Legacy fixtures: only rows created here exist, so the unique constraint is deterministic.
    await sql.unsafe('DELETE FROM public.users')
    await sql.unsafe('DELETE FROM public.planets')
    await sql.unsafe(`
      INSERT INTO public.planets (id, name, image, icon, position) VALUES
        ('7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0f01', 'Legacy 1', 'one.svg', 'one-icon.svg', 1),
        ('7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0f02', 'Legacy 2', 'two.svg', 'two-icon.svg', 2);
      INSERT INTO public.stars (id, name, number, planet_id, slug) VALUES
        ('7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0f11', 'Star 1', 1, '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0f01', 'legacy-star-1');
      INSERT INTO public.users (id, name, email, slug, tier_id, rocket_id, avatar_id) VALUES
        ('migration-test-user', 'Migration Test', 'migration-test@example.test', 'migration-test', NULL, NULL, NULL);
      INSERT INTO public.users_unlocked_stars (user_id, star_id) VALUES
        ('migration-test-user', '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0f11');
      INSERT INTO public.users_recently_unlocked_stars (user_id, star_id) VALUES
        ('migration-test-user', '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0f11')`)
    const before = await snapshotLegacyRows(sql)

    for (const migration of [
      '0003_galaxies',
      '0004_galaxies_catalog',
      '0005_planets_galaxy_required',
    ]) {
      for (const statement of readStatements(migration)) await sql.unsafe(statement)
    }

    // CA-01: catalog, backfill, uniqueness and untouched user rows.
    const galaxies = await sql.unsafe(
      `SELECT id, slug, name, position, status::text AS status, animation FROM public.galaxies ORDER BY position`,
    )
    assert.deepEqual(
      galaxies.map(({ id, slug, name, position, status, animation }) => ({
        id,
        slug,
        name,
        position,
        status,
        animation,
      })),
      [
        {
          id: LOGICA_ID,
          slug: 'logica-de-programacao',
          name: 'Lógica de Programação',
          position: 1,
          status: 'published',
          animation: 'logica-de-programacao.json',
        },
        {
          id: OBJECTS_ID,
          slug: 'orientacao-a-objetos',
          name: 'Orientação a Objetos',
          position: 2,
          status: 'announced',
          animation: 'orientacao-a-objetos.json',
        },
      ],
    )
    const planets = await sql.unsafe(
      `SELECT galaxy_id, position FROM public.planets ORDER BY position`,
    )
    assert.deepEqual(
      planets.map((planet) => [planet.galaxy_id, planet.position]),
      [
        [LOGICA_ID, 1],
        [LOGICA_ID, 2],
      ],
    )
    const [nullability] = await sql.unsafe(`
      SELECT is_nullable FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'planets' AND column_name = 'galaxy_id'`)
    assert.equal(nullability.is_nullable, 'NO')
    await assert.rejects(
      sql.unsafe(
        `SAVEPOINT duplicate_position; INSERT INTO public.planets (name, image, icon, position, galaxy_id) VALUES ('Duplicate', 'd.svg', 'd-icon.svg', 1, '${LOGICA_ID}')`,
      ),
      (error) => error.constraint_name === 'planets_galaxy_id_position_key',
    )
    await sql.unsafe('ROLLBACK TO SAVEPOINT duplicate_position')
    assert.deepEqual(await snapshotLegacyRows(sql), before)
    const [user] = await sql.unsafe(
      `SELECT current_galaxy_id FROM public.users WHERE id = 'migration-test-user'`,
    )
    assert.equal(user.current_galaxy_id, null)

    // CA-02: anon, authenticated and PUBLIC have no privilege on galaxies.
    const [privileges] = await sql.unsafe(`
      SELECT
        (SELECT count(*) FROM information_schema.role_table_grants
          WHERE table_schema = 'public' AND table_name = 'galaxies'
            AND grantee IN ('PUBLIC', 'anon', 'authenticated'))::int AS grants,
        (SELECT count(*) FROM pg_roles r CROSS JOIN unnest(ARRAY['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER']) p
          WHERE r.rolname IN ('anon', 'authenticated')
            AND has_table_privilege(r.rolname, 'public.galaxies', p))::int AS effective`)
    assert.deepEqual(privileges, { grants: 0, effective: 0 })
  } finally {
    await sql.unsafe('ROLLBACK').catch(() => undefined)
    sql.release()
    await pool.end({ timeout: 5 })
  }
})
