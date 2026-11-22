import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import postgres from 'postgres'

const enabled = process.env.STARDUST_LOCAL_MIGRATION_TEST === '1'
const migrationsDirectory = fileURLToPath(
  new URL('../../apps/server/src/database/drizzle/migrations/', import.meta.url),
)
const catalogPath = fileURLToPath(
  new URL(
    '../../apps/server/src/database/seeders/data/seed-catalog.json',
    import.meta.url,
  ),
)
const LOGICA_ID = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a01'
const ARCHIVE_ID = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0a04'
const LEGACY_PLANET_ID = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0e01'
const LEGACY_STAR_ID = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0e11'
const LEGACY_CHALLENGE_STAR_ID = '7a0c1f4e-6c1b-4f2e-9a51-2d3b8e1c0e12'

function readStatements(name) {
  return readFileSync(`${migrationsDirectory}${name}.sql`, 'utf8')
    .split('--> statement-breakpoint')
    .map((statement) => statement.trim())
    .filter((statement) => statement.replace(/^--.*$/gm, '').trim().length > 0)
}

function readInverseStatements() {
  return readFileSync(`${migrationsDirectory}0007_galaxy_trail_catalog.sql`, 'utf8')
    .split(/\r?\n/)
    .filter((line) => line.startsWith('-- inverse> '))
    .map((line) => line.slice('-- inverse> '.length).trim())
}

function readCatalog() {
  return JSON.parse(readFileSync(catalogPath, 'utf8')).tables
}

async function applyHeadAsLegacy(sql) {
  // Simulate the schema state before 0007: legacy catalog, users with progress, old tables.
  await sql.unsafe(`
    DELETE FROM public.users;
    DELETE FROM public.planets;
    DELETE FROM public.galaxies WHERE id = '${ARCHIVE_ID}';
    DROP VIEW IF EXISTS public.users_completed_planets_view;
    CREATE TABLE public.users_unlocked_stars (user_id varchar NOT NULL, star_id uuid NOT NULL);
    CREATE TABLE public.users_recently_unlocked_stars (user_id varchar NOT NULL, star_id uuid NOT NULL);
    INSERT INTO public.galaxies (id, slug, name, description, animation, position, status)
      VALUES ('${LOGICA_ID}', 'logica-de-programacao', 'Lógica de Programação', 'd', 'a.json', 1, 'published')
      ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.planets (id, name, image, icon, position, galaxy_id)
      VALUES ('${LEGACY_PLANET_ID}', 'Legacy', 'legacy.svg', 'legacy-icon.svg', 1, '${LOGICA_ID}');
    INSERT INTO public.stars (id, name, number, planet_id, slug, story, texts, questions, is_challenge) VALUES
      ('${LEGACY_STAR_ID}', 'Legacy star', 1, '${LEGACY_PLANET_ID}', 'legacy-star', 'historia', '[{"type":"default","content":"x"}]'::jsonb, '[]'::jsonb, false),
      ('${LEGACY_CHALLENGE_STAR_ID}', 'Legacy challenge', 2, '${LEGACY_PLANET_ID}', 'legacy-challenge', '', NULL, NULL, true);
    INSERT INTO public.users (id, name, email, slug, has_completed_space, xp, coins, level, streak)
      VALUES ('trail-migration-user', 'Trail Migration', 'trail-migration@example.test', 'trail-migration', true, 340, 120, 3, 4);
    INSERT INTO public.users_unlocked_stars (user_id, star_id)
      VALUES ('trail-migration-user', '${LEGACY_STAR_ID}')`)
}

test('galaxy trail migrations replace the catalog, reset the progress and lock the facts down', {
  skip: !enabled,
}, async () => {
  const url = new URL(process.env.DATABASE_URL)
  assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))
  assert.equal(url.pathname, '/postgres')
  const pool = postgres(url.toString(), { max: 1, onnotice: () => {} })
  const sql = await pool.reserve()
  try {
    await sql.unsafe('BEGIN')
    assert.ok(readInverseStatements().length > 0, 'inverse SQL is documented in 0007')
    await applyHeadAsLegacy(sql)
    for (const statement of readStatements('0007_galaxy_trail_catalog')) {
      await sql.unsafe(statement)
    }

    const catalog = readCatalog()
    // CA-01: ten new planets and 41 stars in the Logic galaxy, matching the contracted table.
    const planets = await sql.unsafe(
      `SELECT id, name, concept, image, position FROM public.planets WHERE galaxy_id = '${LOGICA_ID}' ORDER BY position`,
    )
    assert.equal(planets.length, 10)
    assert.deepEqual(
      planets.map((planet) => planet.position),
      [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    )
    assert.ok(planets.every((planet) => planet.concept && /\.webp$/.test(planet.image)))
    const stars = await sql.unsafe(`
      SELECT s.id, s.name, s.slug, s.number, s.is_challenge, s.description, s.story, s.texts::text AS texts, s.questions::text AS questions
      FROM public.stars s JOIN public.planets p ON p.id = s.planet_id
      WHERE p.galaxy_id = '${LOGICA_ID}'`)
    assert.equal(stars.length, 41)
    assert.equal(new Set(stars.map((star) => star.slug)).size, 41)
    for (const star of stars) {
      assert.equal(star.story, null)
      if (star.is_challenge) {
        assert.match(star.description, /^Desafio final de /)
        assert.equal(star.texts, null)
      } else {
        assert.match(star.description, /^Estrela de história sobre .+\.$/)
        assert.equal(star.questions, '[]')
        assert.match(star.texts, /Conteúdo desta estrela em produção\./)
      }
    }

    // CA-01: the previous trail goes to the unpublished archive without losing rows.
    const [archive] = await sql.unsafe(
      `SELECT slug, status::text AS status FROM public.galaxies WHERE id = '${ARCHIVE_ID}'`,
    )
    assert.deepEqual(archive, { slug: 'trilha-anterior', status: 'unpublished' })
    const archived = await sql.unsafe(
      `SELECT slug FROM public.stars WHERE planet_id = '${LEGACY_PLANET_ID}' ORDER BY number`,
    )
    assert.deepEqual(
      archived.map((star) => star.slug),
      ['legacy-star-trilha-anterior', 'legacy-challenge-trilha-anterior'],
    )
    const [archivedPlanet] = await sql.unsafe(
      `SELECT galaxy_id FROM public.planets WHERE id = '${LEGACY_PLANET_ID}'`,
    )
    assert.equal(archivedPlanet.galaxy_id, ARCHIVE_ID)

    // CA-04: the local seed catalog carries the same identifiers, slugs and positions.
    const catalogPlanets = catalog.planets
      .filter((planet) => planet.galaxy_id === LOGICA_ID)
      .map(({ id, name, position, concept }) => ({ id, name, position, concept }))
      .sort((a, b) => a.position - b.position)
    assert.deepEqual(
      catalogPlanets,
      planets.map(({ id, name, position, concept }) => ({ id, name, position, concept })),
    )
    const catalogStars = catalog.stars
      .filter((star) => catalogPlanets.some((planet) => planet.id === star.planet_id))
      .map(({ id, slug, name, number }) => ({ id, slug, name, number }))
      .sort((a, b) => a.id.localeCompare(b.id))
    assert.deepEqual(
      catalogStars,
      stars
        .map(({ id, slug, name, number }) => ({ id, slug, name, number }))
        .sort((a, b) => a.id.localeCompare(b.id)),
    )

    // CA-02: progress reset keeps the account data and no object references the old tables.
    const [user] = await sql.unsafe(
      `SELECT has_completed_space, xp, coins, level, streak FROM public.users WHERE id = 'trail-migration-user'`,
    )
    assert.deepEqual(user, {
      has_completed_space: false,
      xp: 340,
      coins: 120,
      level: 3,
      streak: 4,
    })
    assert.equal((await sql.unsafe('SELECT 1 FROM public.users_completed_stars')).length, 0)
    assert.equal((await sql.unsafe('SELECT 1 FROM public.users_opened_planets')).length, 0)
    const references = await sql.unsafe(`
      SELECT 'view' AS kind, viewname AS name FROM pg_views
        WHERE schemaname = 'public' AND definition ~ 'users_(recently_)?unlocked_stars'
      UNION ALL
      SELECT 'function', proname FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public' AND p.prosrc ~ 'users_(recently_)?unlocked_stars'`)
    assert.equal(references.length, 0)

    // 0008 drops both legacy tables.
    for (const statement of readStatements('0008_drop_unlocked_stars')) {
      await sql.unsafe(statement)
    }
    const [gone] = await sql.unsafe(`
      SELECT to_regclass('public.users_unlocked_stars') IS NULL AS unlocked,
             to_regclass('public.users_recently_unlocked_stars') IS NULL AS recent`)
    assert.deepEqual(gone, { unlocked: true, recent: true })

    // CA-03: anon, authenticated and PUBLIC have no privilege on the fact tables.
    const [privileges] = await sql.unsafe(`
      SELECT
        (SELECT count(*) FROM information_schema.role_table_grants
          WHERE table_schema = 'public'
            AND table_name IN ('users_completed_stars', 'users_opened_planets')
            AND grantee IN ('PUBLIC', 'anon', 'authenticated'))::int AS grants,
        (SELECT count(*) FROM pg_roles r
          CROSS JOIN unnest(ARRAY['users_completed_stars', 'users_opened_planets']) t
          CROSS JOIN unnest(ARRAY['SELECT','INSERT','UPDATE','DELETE','TRUNCATE','REFERENCES','TRIGGER']) p
          WHERE r.rolname IN ('anon', 'authenticated')
            AND has_table_privilege(r.rolname, 'public.' || t, p))::int AS effective`)
    assert.deepEqual(privileges, { grants: 0, effective: 0 })
  } finally {
    await sql.unsafe('ROLLBACK').catch(() => undefined)
    sql.release()
    await pool.end({ timeout: 5 })
  }
})
