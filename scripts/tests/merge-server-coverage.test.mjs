import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import {
  mergeCoverageReports,
  parseUnitShardsCount,
  resolveReportPaths,
} from '../merge-server-coverage.mjs'

function createReport(hits) {
  const report = {
    path: '/server/adapter.ts',
    statementMap: {},
    fnMap: {},
    branchMap: {},
    s: {},
    f: {},
    b: {},
  }
  const counts = Array.isArray(hits) ? hits : [hits]
  counts.forEach((count, index) => {
    const line = index + 1
    const location = { start: { line, column: 0 }, end: { line, column: 20 } }
    report.statementMap[index] = location
    report.fnMap[index] = { name: `execute${index}`, decl: location, loc: location, line }
    report.s[index] = count
    report.f[index] = count
  })
  return { '/server/adapter.ts': report }
}

test('merges overlapping unit and integration coverage without duplicating functions', () => {
  const directory = mkdtempSync(join(tmpdir(), 'stardust-coverage-'))
  try {
    const unit = join(directory, 'unit.json')
    const integration = join(directory, 'integration.json')
    const output = join(directory, 'summary.json')
    writeFileSync(unit, JSON.stringify(createReport([1, 0])))
    writeFileSync(integration, JSON.stringify(createReport([0, 2])))

    const summary = mergeCoverageReports([unit, integration], output)

    assert.equal(summary.total.functions.total, 2)
    assert.equal(summary.total.functions.covered, 2)
    assert.equal(summary.total.functions.pct, 100)
    assert.deepEqual(JSON.parse(readFileSync(output, 'utf8')), summary)
    assert.equal(JSON.parse(readFileSync(unit, 'utf8'))['/server/adapter.ts'].f[0], 1)
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

test('fails on missing or empty shard reports without replacing the summary', () => {
  const directory = mkdtempSync(join(tmpdir(), 'stardust-coverage-'))
  try {
    const unit = join(directory, 'unit.json')
    const missing = join(directory, 'missing.json')
    const output = join(directory, 'summary.json')
    writeFileSync(unit, JSON.stringify(createReport(1)))
    writeFileSync(output, 'previous summary')
    assert.throws(() => mergeCoverageReports([unit, missing], output), /ENOENT/)
    assert.equal(readFileSync(output, 'utf8'), 'previous summary')
    writeFileSync(missing, '{}')
    assert.throws(() => mergeCoverageReports([unit, missing], output), /Empty coverage/)
    assert.equal(readFileSync(output, 'utf8'), 'previous summary')
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
})

function createUnloadedReport() {
  const location = { start: { line: 1, column: 0 }, end: { line: 2, column: 20 } }
  const lines = [1, 2].map((line) => ({
    start: { line, column: 0 },
    end: { line, column: 20 },
  }))
  return {
    '/server/adapter.ts': {
      path: '/server/adapter.ts',
      statementMap: { ...lines },
      fnMap: { 0: { name: '(empty-report)', decl: location, loc: location, line: 1 } },
      branchMap: {
        0: { type: 'branch', line: 1, loc: location, locations: [location] },
      },
      s: { 0: 0, 1: 0 },
      f: { 0: 0 },
      b: { 0: [0] },
    },
  }
}

function mergeToLcov(reports) {
  const directory = mkdtempSync(join(tmpdir(), 'stardust-coverage-'))
  try {
    const inputs = reports.map((report, index) => {
      const input = join(directory, `${index}.json`)
      writeFileSync(input, JSON.stringify(report))
      return input
    })
    const lcovPath = join(directory, 'lcov.info')
    const summary = mergeCoverageReports(inputs, join(directory, 'summary.json'), {
      lcovPath,
      root: '/server',
    })
    return { summary, lcov: readFileSync(lcovPath, 'utf8') }
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
}

test('ignores the unloaded record of a file that another shard loaded', () => {
  for (const reports of [
    [createUnloadedReport(), createReport([1, 0])],
    [createReport([1, 0]), createUnloadedReport()],
  ]) {
    const { summary } = mergeToLcov(reports)

    assert.equal(summary.total.functions.total, 2)
    assert.equal(summary.total.branches.total, 0)
    assert.equal(summary.total.lines.covered, 1)
  }
})

test('keeps a file that no shard loaded as uncovered', () => {
  const { summary, lcov } = mergeToLcov([createUnloadedReport(), createUnloadedReport()])

  assert.equal(summary.total.lines.total, 2)
  assert.equal(summary.total.lines.covered, 0)
  assert.equal(summary.total.functions.total, 1)
  assert.equal(lcov, 'SF:adapter.ts\nDA:1,0\nDA:2,0\nBRDA:1,0,0,0\nend_of_record\n')
})

test('resolves one unit report locally and one per shard in CI, plus six integration shards', () => {
  const relative = (paths) => paths.map((path) => path.replace('/coverage/', ''))
  const integration = [1, 2, 3, 4, 5, 6].map(
    (shard) => `integration-${shard}/coverage-final.json`,
  )
  assert.deepEqual(relative(resolveReportPaths('/coverage')), [
    'coverage-final.json',
    ...integration,
  ])
  assert.deepEqual(relative(resolveReportPaths('/coverage', 2)), [
    'unit-1/coverage-final.json',
    'unit-2/coverage-final.json',
    ...integration,
  ])
})

test('reads the unit shards count from the arguments and rejects invalid values', () => {
  assert.equal(parseUnitShardsCount([]), 0)
  assert.equal(parseUnitShardsCount(['--unit-shards=2']), 2)
  for (const value of ['0', '-1', 'two', '']) {
    assert.throws(() => parseUnitShardsCount([`--unit-shards=${value}`]), /Invalid/)
  }
})
