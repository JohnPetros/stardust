import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  measureChangedCoverage,
  parseArguments,
  parseChangedLines,
  parseLcov,
  renderChangedCoverage,
} from '../check-changed-coverage.mjs'

const SCRIPT = fileURLToPath(new URL('../check-changed-coverage.mjs', import.meta.url))
const SOURCE = 'apps/web/src/a.ts'
const LCOV = [
  `SF:${SOURCE}`,
  'DA:1,1',
  'DA:2,0',
  'DA:3,4',
  'BRDA:3,0,0,2',
  'BRDA:3,0,1,0',
  'BRDA:9,1,0,-',
  'end_of_record',
].join('\n')

test('reads added line numbers from a zero-context diff', () => {
  const changed = parseChangedLines(
    [
      'diff --git a/one.ts b/one.ts',
      '--- a/one.ts',
      '+++ b/one.ts',
      '@@ -1 +1,2 @@',
      '+++ counter',
      '@@ -8,2 +9,0 @@',
      '@@ -20 +20 @@',
      'diff --git a/gone.ts b/gone.ts',
      '--- a/gone.ts',
      '+++ /dev/null',
      '@@ -1,3 +0,0 @@',
    ].join('\n'),
  )

  assert.deepEqual([...changed.keys()], ['one.ts'])
  assert.deepEqual([...changed.get('one.ts')], [1, 2, 20])
})

test('measures only changed executable lines and branches', () => {
  const result = measureChangedCoverage(
    parseLcov(LCOV),
    new Map([
      [SOURCE, new Set([2, 3, 4])],
      ['apps/web/src/tests/a.test.ts', new Set([1])],
      ['apps/server/src/b.ts', new Set([1])],
    ]),
    'apps/web/src',
  )

  assert.deepEqual(result.totals, {
    lines: { covered: 1, total: 2 },
    branches: { covered: 1, total: 2 },
  })
  assert.deepEqual(result.gaps, [
    { path: SOURCE, uncoveredLines: [2], partialLines: [3] },
  ])
  assert.match(
    renderChangedCoverage('web', result, { lines: 80, branches: 50 }),
    /\| Lines \| 50\.00% \| 80% \| 1 \/ 2 \| FAIL \|\n\| Branches \| 50\.00% \| 50% \| 1 \/ 2 \| PASS \|/,
  )
})

test('passes a metric with nothing to measure', () => {
  const result = measureChangedCoverage(parseLcov(LCOV), new Map(), 'apps/web/src')

  assert.match(
    renderChangedCoverage('web', result, { lines: 80, branches: 70 }),
    /\| Lines \| N\/A \| 80% \| 0 \/ 0 \| PASS \|/,
  )
})

test('fails closed when the report does not match the workspace paths', () => {
  assert.throws(
    () => measureChangedCoverage(parseLcov(LCOV), new Map(), 'apps/server/src'),
    /no files under apps\/server\/src/,
  )
})

test('requires a known workspace, a report, a base and valid thresholds', () => {
  assert.equal(parseArguments(['web', 'lcov.info', '--base', 'HEAD']).lines, 80)
  assert.throws(() => parseArguments(['email', 'lcov.info', '--base', 'HEAD']), /Usage/)
  assert.throws(() => parseArguments(['web', 'lcov.info']), /Usage/)
  assert.throws(
    () => parseArguments(['web', 'lcov.info', '--base', 'HEAD', '--lines', '101']),
    /from 0 to 100/,
  )
})

test('CLI fails on uncovered changed lines and appends its report', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'changed-coverage-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const git = (...args) =>
    execFileSync(
      'git',
      ['-c', 'user.name=test', '-c', 'user.email=test@example.com', ...args],
      { cwd: root },
    )
  mkdirSync(join(root, 'apps/web/src'), { recursive: true })
  git('init', '-q')
  git('commit', '-q', '--allow-empty', '-m', 'base')
  writeFileSync(join(root, SOURCE), 'one\ntwo\nthree\n')
  git('add', '.')
  git('commit', '-q', '-m', 'change')
  writeFileSync(join(root, 'lcov.info'), LCOV)
  writeFileSync(join(root, 'comment.md'), 'Totals\n')
  const run = (...extra) =>
    spawnSync(
      process.execPath,
      [
        SCRIPT,
        'web',
        'lcov.info',
        '--base',
        'HEAD^1',
        '--output',
        'comment.md',
        ...extra,
      ],
      { cwd: root, encoding: 'utf8', env: { ...process.env, GITHUB_STEP_SUMMARY: '' } },
    )

  const failing = run()
  assert.equal(failing.status, 1, failing.stderr)
  assert.match(failing.stdout, /\| Lines \| 66\.67% \| 80% \| 2 \/ 3 \| FAIL \|/)
  assert.equal(
    readFileSync(join(root, 'comment.md'), 'utf8'),
    `Totals\n\n${failing.stdout}`,
  )
  assert.equal(run('--lines', '60', '--branches', '50').status, 0)
  assert.equal(run('--working-tree', '--head', 'HEAD').status, 1)
})

test('CLI measures uncommitted and untracked lines of the working tree', (t) => {
  const root = mkdtempSync(join(tmpdir(), 'changed-coverage-'))
  t.after(() => rmSync(root, { recursive: true, force: true }))
  const git = (...args) =>
    execFileSync(
      'git',
      ['-c', 'user.name=test', '-c', 'user.email=test@example.com', ...args],
      { cwd: root },
    )
  mkdirSync(join(root, 'apps/web/src'), { recursive: true })
  writeFileSync(join(root, SOURCE), 'one\n')
  git('init', '-q')
  git('add', '.')
  git('commit', '-q', '-m', 'base')
  writeFileSync(join(root, SOURCE), 'one\ntwo\nthree\n')
  writeFileSync(join(root, 'apps/web/src/new.ts'), 'one\n')
  const report = [LCOV, 'SF:apps/web/src/new.ts', 'DA:1,0', 'end_of_record']
  writeFileSync(join(root, 'lcov.info'), report.join('\n'))
  const run = (...extra) =>
    spawnSync(
      process.execPath,
      [SCRIPT, 'web', 'lcov.info', '--base', 'HEAD', ...extra],
      { cwd: root, encoding: 'utf8', env: { ...process.env, GITHUB_STEP_SUMMARY: '' } },
    )

  assert.match(run().stdout, /\| Lines \| N\/A \|/)
  const result = run('--working-tree')
  assert.equal(result.status, 1, result.stderr)
  assert.match(result.stdout, /\| Lines \| 33\.33% \| 80% \| 1 \/ 3 \| FAIL \|/)
})
