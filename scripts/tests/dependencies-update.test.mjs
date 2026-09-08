import test from 'node:test'
import assert from 'node:assert/strict'
import { assertScriptSyntax } from './helpers.mjs'
import { doctorTestFor } from '../dependencies-update.mjs'

test('dependencies update script has valid syntax', () =>
  assertScriptSyntax('dependencies-update.mjs'))

test('doctor validates the root manifest from the repository root', () => {
  const command = doctorTestFor(
    'package.json',
    { name: 'stardust' },
    '/workspace/stardust',
  )

  assert.match(
    command,
    /npm --prefix "\/workspace\/stardust" run check:dependencies-update:doctor/,
  )
  assert.doesNotMatch(command, /--workspace/)
})

test('doctor validates a workspace from its package directory', () => {
  const command = doctorTestFor(
    'apps/server/package.json',
    {
      scripts: {
        'check:code': 'biome check src',
        'check:types': 'tsc --noEmit',
        'test:unit': 'jest',
      },
    },
    '/workspace/stardust',
  )

  assert.equal(
    command,
    'env NODE_OPTIONS=--max-old-space-size=8192 TURBO_CONCURRENCY=1 npm --prefix "/workspace/stardust/apps/server" run check:code && npm --prefix "/workspace/stardust/apps/server" run check:types && npm --prefix "/workspace/stardust/apps/server" run test:unit',
  )
  assert.doesNotMatch(command, /--workspace/)
})

test('doctor skips checks that a workspace does not define', () => {
  const command = doctorTestFor(
    'packages/email/package.json',
    {
      scripts: {
        'check:code': 'biome check templates partials',
        'check:types': 'tsc --noEmit',
      },
    },
    '/workspace/stardust',
  )

  assert.match(command, /run check:code && .* run check:types$/)
  assert.doesNotMatch(command, /test:unit/)
})
