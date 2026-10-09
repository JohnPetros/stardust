import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { cp, mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const projectRoot = fileURLToPath(new URL('../..', import.meta.url))
const exporterPath = join(projectRoot, 'scripts/export-local-database-env.mjs')

async function createFixture(envContent) {
  const root = await mkdtemp(join(tmpdir(), 'stardust-local-database-env-'))
  await mkdir(join(root, 'scripts'), { recursive: true })
  await cp(exporterPath, join(root, 'scripts/export-local-database-env.mjs'))
  await writeFile(join(root, '.env.local'), envContent)
  execFileSync('git', ['init', '--quiet'], { cwd: root })
  return root
}

test('exports the local loopback URL with the configured port and encoded password', async (t) => {
  const root = await createFixture(
    'SUPABASE_DATABASE_PASSWORD="test pass:$word"\nSUPABASE_DATABASE_PORT=55432\n',
  )
  t.after(() => rm(root, { recursive: true, force: true }))

  const result = spawnSync(
    process.execPath,
    [join(root, 'scripts/export-local-database-env.mjs')],
    {
      cwd: root,
      encoding: 'utf8',
    },
  )

  assert.equal(result.status, 0)
  assert.equal(result.stderr, '')
  assert.match(
    result.stdout,
    /^export DATABASE_URL='postgresql:\/\/postgres:test%20pass%3A\$word@127\.0\.0\.1:55432\/postgres\?sslmode=disable'\n$/,
  )
})

test('uses the Compose database port default when it is not configured', async (t) => {
  const root = await createFixture('SUPABASE_DATABASE_PASSWORD=synthetic-password\n')
  t.after(() => rm(root, { recursive: true, force: true }))

  const result = spawnSync(
    process.execPath,
    [join(root, 'scripts/export-local-database-env.mjs')],
    {
      cwd: root,
      encoding: 'utf8',
    },
  )

  assert.equal(result.status, 0)
  assert.match(result.stdout, /@127\.0\.0\.1:54322\/postgres\?sslmode=disable/)
})

test('exports local MinIO credentials without printing them as diagnostics', async (t) => {
  const root = await createFixture(
    'SUPABASE_DATABASE_PASSWORD=db-password\nMINIO_ROOT_USER=local-user\nMINIO_ROOT_PASSWORD="local password:$word"\nMINIO_API_PORT=19000\n',
  )
  t.after(() => rm(root, { recursive: true, force: true }))

  const result = spawnSync(
    process.execPath,
    [join(root, 'scripts/export-local-database-env.mjs')],
    { cwd: root, encoding: 'utf8' },
  )

  assert.equal(result.status, 0)
  assert.match(result.stdout, /export S3_ACCESS_KEY_ID='local-user'/)
  assert.match(result.stdout, /export S3_SECRET_ACCESS_KEY='local password:\$word'/)
  assert.match(result.stdout, /export S3_ENDPOINT='http:\/\/127\.0\.0\.1:19000'/)
  assert.equal(result.stderr, '')
})

test('rejects missing password without exposing environment values', async (t) => {
  const secretFixture = 'synthetic-password-must-not-appear'
  const root = await createFixture(`ANOTHER_KEY=${secretFixture}\n`)
  t.after(() => rm(root, { recursive: true, force: true }))

  const result = spawnSync(
    process.execPath,
    [join(root, 'scripts/export-local-database-env.mjs')],
    {
      cwd: root,
      encoding: 'utf8',
    },
  )

  assert.equal(result.status, 1)
  assert.match(result.stderr, /SUPABASE_DATABASE_PASSWORD is required/)
  assert.doesNotMatch(result.stdout + result.stderr, new RegExp(secretFixture))
})

test('rejects an invalid port without exposing environment values', async (t) => {
  const secretFixture = 'synthetic-password-must-not-appear'
  const root = await createFixture(
    `SUPABASE_DATABASE_PASSWORD=${secretFixture}\nSUPABASE_DATABASE_PORT=70000\n`,
  )
  t.after(() => rm(root, { recursive: true, force: true }))

  const result = spawnSync(
    process.execPath,
    [join(root, 'scripts/export-local-database-env.mjs')],
    {
      cwd: root,
      encoding: 'utf8',
    },
  )

  assert.equal(result.status, 1)
  assert.match(result.stderr, /SUPABASE_DATABASE_PORT must be a valid TCP port/)
  assert.doesNotMatch(result.stdout + result.stderr, new RegExp(secretFixture))
})
