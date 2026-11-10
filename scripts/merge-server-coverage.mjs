import { readFileSync, writeFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import coverage from 'istanbul-lib-coverage'

const ROOT_DIRECTORY = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const COVERAGE_DIRECTORY = resolve(ROOT_DIRECTORY, 'apps/server/coverage')

export function mergeCoverageReports(inputPaths, summaryPath) {
  const combined = coverage.createCoverageMap({})
  for (const inputPath of inputPaths) {
    const report = JSON.parse(readFileSync(inputPath, 'utf8'))
    if (Object.keys(report).length === 0) {
      throw new Error(`Empty coverage report: ${inputPath}`)
    }
    combined.merge(report)
  }
  const summary = { total: combined.getCoverageSummary().toJSON() }
  for (const file of combined.files()) {
    summary[file] = combined.fileCoverageFor(file).toSummary().toJSON()
  }
  writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`)
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
    )
    console.log('Merged Server unit coverage and all six integration shards.')
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
