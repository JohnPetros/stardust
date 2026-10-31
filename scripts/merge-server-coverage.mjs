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

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    mergeCoverageReports(
      [
        resolve(COVERAGE_DIRECTORY, 'coverage-final.json'),
        ...[1, 2, 3, 4].map((shard) =>
          resolve(COVERAGE_DIRECTORY, `integration-${shard}/coverage-final.json`),
        ),
      ],
      resolve(COVERAGE_DIRECTORY, 'coverage-summary.json'),
    )
    console.log('Merged Server unit coverage and all four integration shards.')
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error))
    process.exitCode = 1
  }
}
