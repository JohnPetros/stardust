import test from 'node:test'
import assert from 'node:assert/strict'
import { assertScriptSyntax } from './helpers.mjs'
import { doctorTestFor, exactOverrideUpdateNames } from '../dependencies-update.mjs'

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

test('detects root dependencies whose exact overrides must be updated together', () => {
  const names = exactOverrideUpdateNames(
    {
      overrides: {
        hono: '4.13.1',
        react: '19.2.8',
        'nested-only': {
          hono: '4.13.1',
        },
      },
    },
    [
      {
        workspace: 'package.json',
        package: 'hono',
        to: '4.13.7',
      },
      {
        workspace: 'apps/server/package.json',
        package: 'react',
        to: '^19.2.9',
      },
    ],
  )

  assert.deepEqual(names, ['hono'])
})
