import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import postgres from 'postgres'

const root = fileURLToPath(new URL('../../', import.meta.url))
const enabled = process.env.STARDUST_LOCAL_SEED_TEST === '1'

function runSeed() {
  return spawnSync(
    process.execPath,
    ['--import', 'tsx', 'apps/server/src/database/seed.ts'],
    {
      cwd: root,
      env: process.env,
      encoding: 'utf8',
      timeout: 30000,
    },
  )
}

async function fingerprint(sql) {
  const [result] = await sql`
    SELECT md5(concat(
      (SELECT jsonb_agg(to_jsonb(t) ORDER BY id)::text FROM public.users t),
      (SELECT jsonb_agg(to_jsonb(t) ORDER BY id)::text FROM public.stars t),
      (SELECT jsonb_agg(to_jsonb(t) ORDER BY id)::text FROM public.notes t),
      (SELECT jsonb_agg(to_jsonb(t) ORDER BY id)::text FROM auth.users t)
    )) AS digest`
  return result.digest
}

test('local seed can be repeated, authenticates both accounts and rolls back all changes on failure', {
  skip: !enabled,
}, async () => {
  const url = new URL(process.env.DATABASE_URL)
  assert.ok(['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))
  assert.equal(url.pathname, '/postgres')
  const sql = postgres(url.toString(), { max: 1, onnotice: () => {} })
  try {
    for (let attempt = 0; attempt < 2; attempt++) {
      const result = runSeed()
      assert.equal(result.status, 0, result.stderr)
      const [counts] = await sql`
        SELECT (SELECT count(*) FROM public.planets)::int AS planets,
          (SELECT count(*) FROM public.stars)::int AS stars,
          (SELECT count(*) FROM public.challenges)::int AS challenges,
          (SELECT count(*) FROM public.users)::int AS profiles,
          (SELECT count(*) FROM auth.users)::int AS accounts`
      assert.equal(counts.profiles, 2)
      assert.equal(counts.accounts, 2)
      assert.ok(
        counts.planets > 0 && counts.stars > counts.planets && counts.challenges > 0,
      )
      const [content] = await sql`
        SELECT count(*)::int AS count FROM public.stars
        WHERE texts IS NOT NULL AND jsonb_array_length(texts) > 0`
      assert.ok(content.count > 0)
    }
    const authUrl = `http://127.0.0.1:${process.env.SUPABASE_API_PORT || '54321'}`
    const accounts = JSON.parse(readFileSync(new URL('../../apps/server/src/database/seeders/data/seed-accounts.json', import.meta.url), 'utf8'))
    for (const [index, app] of ['WEB', 'STUDIO'].entries()) {
      const login = await fetch(`${authUrl}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          apikey: process.env.SUPABASE_PUBLISHABLE_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: accounts[index].email,
          password: accounts[index].password,
        }),
      })
      assert.equal(login.status, 200, `${app} login`)
      const session = await login.json()
      const headers = {
        apikey: process.env.SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${session.access_token}`,
      }
      const response = await fetch(`${authUrl}/auth/v1/user`, { headers })
      assert.equal(response.status, 200, `${app} account verification`)
      const account = await response.json()
      const profiles = await sql`SELECT id FROM public.users WHERE id = ${account.id}`
      assert.equal(profiles.length, 1, `${app} application profile`)
      if (app === 'STUDIO')
        assert.equal(account.id, accounts[index].id)
      await fetch(`${authUrl}/auth/v1/logout`, { method: 'POST', headers })
    }
    const before = await fingerprint(sql)
    await sql`CREATE FUNCTION public.seed_failure_probe() RETURNS trigger LANGUAGE plpgsql AS 'BEGIN RAISE EXCEPTION ''Intentional seed rollback probe''; END'`
    try {
      await sql`CREATE TRIGGER seed_failure_probe BEFORE INSERT ON public.stars FOR EACH ROW EXECUTE FUNCTION public.seed_failure_probe()`
      const failure = runSeed()
      assert.equal(failure.status, 1)
      assert.match(failure.stderr, /rolled back/)
      assert.equal(await fingerprint(sql), before)
    } finally {
      await sql`DROP TRIGGER IF EXISTS seed_failure_probe ON public.stars`
      await sql`DROP FUNCTION IF EXISTS public.seed_failure_probe()`
    }
  } finally {
    await sql.end({ timeout: 5 })
  }
})
