import assert from 'node:assert/strict'
import { randomBytes } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'

const root = fileURLToPath(new URL('../../', import.meta.url))
const seed = 'apps/server/src/database/seed.ts'

function runSeed(argumentsList, overrides = {}) {
  const password = randomBytes(16).toString('hex')
  return spawnSync(process.execPath, ['--import', 'tsx', seed, ...argumentsList], {
    cwd: root,
    encoding: 'utf8',
    timeout: 15000,
    env: {
      PATH: process.env.PATH,
      DATABASE_URL: 'postgresql://postgres@127.0.0.1:1/postgres',
      WEB_APP_E2E_EMAIL: 'explorer@example.test',
      WEB_APP_E2E_PASSWORD: password,
      STUDIO_APP_E2E_EMAIL: 'studio@example.test',
      STUDIO_APP_E2E_PASSWORD: password,
      GOD_ACCOUNT_IDS: '00000000-0000-4000-8000-000000000002',
      ...overrides,
    },
  })
}

test('seed preflight validates the snapshot without connecting to a database', () => {
  const result = runSeed(['--check'])
  assert.equal(result.status, 0, result.stderr)
  assert.match(result.stdout, /8 planets, 39 stars, 27 challenges/)
  assert.match(result.stdout, /No database changes/)
})

test('seed refuses remote databases and connection parameter overrides before connecting', () => {
  for (const DATABASE_URL of [
    'postgresql://postgres@staging.example.test:5432/postgres',
    'postgresql://postgres@127.0.0.1:54322/postgres?host=staging.example.test',
    'postgresql://postgres@127.0.0.1:54322/another_database',
  ]) {
    const result = runSeed([], { DATABASE_URL })
    assert.equal(result.status, 1)
    assert.match(result.stderr, /remote reset is forbidden/)
  }
})

test('seed refuses production mode even with a loopback database', () => {
  const result = runSeed([], { MODE: 'production' })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /remote reset is forbidden/)
})

test('seed uses fixed accounts without E2E credentials', () => {
  const result = runSeed(['--check'], {
    STUDIO_APP_E2E_PASSWORD: '', WEB_APP_E2E_PASSWORD: '',
    STUDIO_APP_E2E_EMAIL: '', WEB_APP_E2E_EMAIL: '',
  })
  assert.equal(result.status, 0, result.stderr)
})

test('seed requires the fixed Studio UUID in the admin allowlist', () => {
  const result = runSeed(['--check'], { GOD_ACCOUNT_IDS: '00000000-0000-4000-8000-000000000003' })
  assert.equal(result.status, 1)
  assert.match(result.stderr, /fixed local Studio seed UUID/)
})

test('seed help works without credentials and unknown arguments fail without connecting', () => {
  const help = runSeed(['--help'], { DATABASE_URL: '', WEB_APP_E2E_PASSWORD: '' })
  assert.equal(help.status, 0, help.stderr)
  assert.match(help.stdout, /replaces local application data and Auth users/)
  const invalid = runSeed(['--remote'])
  assert.equal(invalid.status, 1)
  assert.match(invalid.stderr, /Unknown seed argument/)
})
