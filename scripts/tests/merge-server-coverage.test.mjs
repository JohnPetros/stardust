import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { mergeCoverageReports } from '../merge-server-coverage.mjs'

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
