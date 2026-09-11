import assert from 'node:assert/strict'
import test from 'node:test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  createCliArguments,
  getScopePatterns,
  materializeBaseline,
  normalizeBaseline,
} from '../check-complexity.mjs'

const ROOT_DIRECTORY = fileURLToPath(new URL('../..', import.meta.url))

function createMetric(name, severity) {
  return { name, value: 20, threshold: 15, severity }
}

function createFunction(name, severity) {
  return {
    name,
    startLine: 10,
    endLine: 20,
    metrics: [createMetric('cyclomaticComplexity', severity)],
    maintainabilityIndex: 80,
    maintainabilityRating: 'ok',
    healthScore: 80,
    smells: [],
  }
}

test('normalizes a CodeMultiVitals baseline to repository-relative violation paths', () => {
  const baseline = {
    analysedAt: '2026-09-07T00:00:00.000Z',
    files: [
      {
        filePath: path.join(ROOT_DIRECTORY, 'apps/server/src/app.module.ts'),
        functions: [createFunction('healthy', 'ok'), createFunction('legacy', 'warn')],
      },
    ],
    clones: [
      {
        blockA: { filePath: path.join(ROOT_DIRECTORY, 'apps/server/src/a.ts') },
        blockB: { filePath: path.join(ROOT_DIRECTORY, 'apps/server/src/b.ts') },
      },
    ],
  }

  const normalized = normalizeBaseline(baseline)

  assert.equal(normalized.files.length, 1)
  assert.equal(normalized.files[0].filePath, 'apps/server/src/app.module.ts')
  assert.deepEqual(
    normalized.files[0].functions.map(({ name }) => name),
    ['legacy'],
  )
  assert.equal(normalized.clones[0].blockA.filePath, 'apps/server/src/a.ts')
})

test('materializes repository-relative baseline paths for the current runner', () => {
  const materialized = materializeBaseline({
    files: [{ filePath: 'apps/server/src/app.module.ts', functions: [] }],
    clones: [
      {
        blockA: { filePath: 'apps/server/src/a.ts' },
        blockB: { filePath: 'apps/server/src/b.ts' },
      },
    ],
  })

  assert.equal(
    materialized.files[0].filePath,
    path.join(ROOT_DIRECTORY, 'apps/server/src/app.module.ts'),
  )
  assert.equal(
    materialized.clones[0].blockB.filePath,
    path.join(ROOT_DIRECTORY, 'apps/server/src/b.ts'),
  )
})

test('builds CodeMultiVitals CLI arguments with quality gates', () => {
  const argumentsList = createCliArguments('/tmp/baseline.json', null)

  assert.ok(argumentsList.includes('apps/studio/src/**/*.{ts,tsx}'))
  assert.ok(argumentsList.includes('!**/*.test.ts'))
  assert.ok(
    argumentsList.includes('!apps/server/src/database/supabase/types/Database.ts'),
  )
  assert.ok(argumentsList.includes('--min-duplicate-lines'))
  assert.ok(argumentsList.includes('999999'))
  assert.deepEqual(argumentsList.slice(-4), [
    '--min-duplicate-lines',
    '999999',
    '--baseline',
    '/tmp/baseline.json',
  ])
})

test('builds a scoped source pattern list for each app or package', () => {
  assert.deepEqual(getScopePatterns('apps/studio'), [
    'apps/studio/src/**/*.{ts,tsx}',
    '!**/*.test.ts',
    '!**/*.test.tsx',
    '!**/tests/**',
    '!**/routeTree.gen.ts',
    '!apps/server/src/database/supabase/types/Database.ts',
  ])
  assert.ok(
    createCliArguments(null, null, getScopePatterns('packages/core')).includes(
      'packages/core/src/**/*.ts',
    ),
  )
})

test('rejects an unknown complexity scope', () => {
  assert.throws(() => getScopePatterns('apps/unknown'), /Unknown complexity scope/)
})
