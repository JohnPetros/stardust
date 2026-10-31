import assert from 'node:assert/strict'
import test from 'node:test'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { applyBaseline } from 'code-multivitals'
import {
  alignBaselineLocations,
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

  assert.ok(argumentsList.includes('apps/backoffice/src/**/*.{ts,tsx}'))
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
  assert.deepEqual(getScopePatterns('apps/backoffice'), [
    'apps/backoffice/src/**/*.{ts,tsx}',
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

function createAnalysis(functions) {
  return { files: [{ filePath: 'apps/web/src/example.ts', functions }], clones: [] }
}

test('baseline generation preserves existing file order and appends new files deterministically', () => {
  const file = (filePath) => ({ filePath, functions: [createFunction('legacy', 'warn')] })
  const baseline = {
    files: [file('b.ts'), file('new-z.ts'), file('a.ts'), file('new-a.ts')],
    clones: [],
  }
  const previous = { files: [file('a.ts'), file('b.ts')] }

  assert.deepEqual(
    normalizeBaseline(baseline, previous).files.map((item) => item.filePath),
    ['a.ts', 'b.ts', 'new-a.ts', 'new-z.ts'],
  )
})

test('ignores line-only moves of uniquely named functions without changing baseline metrics', () => {
  const original = createFunction('initializeAnalytics', 'warn')
  const baseline = createAnalysis([original])
  const current = createAnalysis([{ ...original, startLine: 30, endLine: 40 }])
  const aligned = alignBaselineLocations(baseline, current)

  assert.equal(applyBaseline(current, aligned).warnCount, 0)
  assert.deepEqual(aligned.files[0].functions[0].metrics, original.metrics)
  assert.equal(baseline.files[0].functions[0].startLine, 10)
})

test('still reports new, worsened and changed functions after a line move', () => {
  const original = createFunction('initializeAnalytics', 'warn')
  const baseline = createAnalysis([original])
  for (const changed of [
    { ...createFunction('newFunction', 'warn'), startLine: 30 },
    { ...createFunction('initializeAnalytics', 'error'), startLine: 30 },
    { ...original, startLine: 30, maintainabilityIndex: 70 },
  ]) {
    const current = createAnalysis([changed])
    const result = applyBaseline(current, alignBaselineLocations(baseline, current))
    assert.equal(result.warnCount + result.errorCount, 1)
  }
})

test('does not relocate anonymous functions or ambiguous duplicate names', () => {
  for (const name of ['<anonymous>', 'handle']) {
    const original = createFunction(name, 'warn')
    const functions =
      name === 'handle' ? [original, { ...original, startLine: 20 }] : [original]
    const baseline = createAnalysis(functions)
    const current = createAnalysis(
      functions.map((fn) => ({ ...fn, startLine: fn.startLine + 30 })),
    )
    assert.deepEqual(alignBaselineLocations(baseline, current), baseline)
  }
})
