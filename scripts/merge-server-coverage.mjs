import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname, relative, sep } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import coverage from 'istanbul-lib-coverage'

const ROOT_DIRECTORY = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const COVERAGE_DIRECTORY = resolve(ROOT_DIRECTORY, 'apps/server/coverage')

// With the V8 provider, Jest records a file that a shard never loaded as one
// uncovered "(empty-report)" function and branch spanning the whole file.
function isUnloaded(fileCoverage) {
  const functions = Object.values(fileCoverage.fnMap)
  return functions.length === 1 && functions[0].name === '(empty-report)'
}

function readShardReports(inputPaths) {
  const files = new Map()
  for (const inputPath of inputPaths) {
    const report = JSON.parse(readFileSync(inputPath, 'utf8'))
    if (Object.keys(report).length === 0) {
      throw new Error(`Empty coverage report: ${inputPath}`)
    }
    for (const [file, fileCoverage] of Object.entries(report)) {
      files.set(file, [...(files.get(file) ?? []), fileCoverage])
    }
  }
  return files
}

// An unloaded record only counts when no shard loaded the file; merging it with a
// real one would add a function and a branch that do not exist.
function combineShardReports(files) {
  const combined = coverage.createCoverageMap({})
  for (const [file, records] of files) {
    const loaded = records.filter((record) => !isUnloaded(record))
    for (const record of loaded.length ? loaded : records.slice(0, 1)) {
      combined.merge({ [file]: record })
    }
  }
  return combined
}

function toLcovRecord(fileCoverage, root) {
  const path = relative(root, fileCoverage.path).split(sep).join('/')
  const lines = Object.entries(fileCoverage.getLineCoverage()).map(
    ([line, hits]) => `DA:${line},${hits}`,
  )
  const branches = Object.entries(fileCoverage.data.branchMap).flatMap(
    ([id, { loc, line }]) =>
      fileCoverage.data.b[id].map(
        (hits, index) => `BRDA:${loc?.start.line ?? line},${id},${index},${hits}`,
      ),
  )
  return [`SF:${path}`, ...lines, ...branches, 'end_of_record'].join('\n')
}

export function renderLcov(coverageMap, root) {
  const records = coverageMap
    .files()
    .sort()
    .map((file) => toLcovRecord(coverageMap.fileCoverageFor(file), root))
  return `${records.join('\n')}\n`
}

export function mergeCoverageReports(
  inputPaths,
  summaryPath,
  { lcovPath, root = ROOT_DIRECTORY } = {},
) {
  const combined = combineShardReports(readShardReports(inputPaths))
  const summary = { total: combined.getCoverageSummary().toJSON() }
  for (const file of combined.files()) {
    summary[file] = combined.fileCoverageFor(file).toSummary().toJSON()
  }
  writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`)
  if (lcovPath) writeFileSync(lcovPath, renderLcov(combined, root))
  return summary
}

const INTEGRATION_SHARDS_COUNT = 6

function listShards(count) {
  return Array.from({ length: count }, (_, index) => index + 1)
}

// Locally the unit suite runs in one process and writes a single report; CI splits it
// into shards and passes their count.
export function resolveReportPaths(coverageDirectory, unitShardsCount = 0) {
  const unitReports = unitShardsCount
    ? listShards(unitShardsCount).map((shard) =>
        resolve(coverageDirectory, `unit-${shard}/coverage-final.json`),
      )
    : [resolve(coverageDirectory, 'coverage-final.json')]
  return [
    ...unitReports,
    ...listShards(INTEGRATION_SHARDS_COUNT).map((shard) =>
      resolve(coverageDirectory, `integration-${shard}/coverage-final.json`),
    ),
  ]
}

export function parseUnitShardsCount(args) {
  const value = args.find((arg) => arg.startsWith('--unit-shards='))?.split('=')[1]
  if (value === undefined) return 0
  if (!/^[1-9]\d*$/.test(value)) throw new Error(`Invalid --unit-shards value: ${value}`)
  return Number(value)
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    mergeCoverageReports(
      resolveReportPaths(COVERAGE_DIRECTORY, parseUnitShardsCount(process.argv.slice(2))),
      resolve(COVERAGE_DIRECTORY, 'coverage-summary.json'),
      { lcovPath: resolve(COVERAGE_DIRECTORY, 'lcov.info') },
    )
    console.log('Merged Server unit coverage and all six integration shards.')
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
