import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const WORKSPACES = { core: 'Core', server: 'Server', web: 'Web' }
const METRICS = ['statements', 'branches', 'functions', 'lines']
const FLOORS_PATH = resolve(
  dirname(fileURLToPath(import.meta.url)),
  '..',
  'coverage-baseline.json',
)
const [, , workspace, summaryPath, outputPath] = process.argv

if (!workspace || !summaryPath || !outputPath) {
  throw new Error(
    'Usage: node scripts/write-coverage-report.mjs <core|server|web> <summary-path> <output-path>',
  )
}
if (!WORKSPACES[workspace]) throw new Error(`Unknown coverage workspace: ${workspace}`)

const summary = JSON.parse(await readFile(summaryPath, 'utf8'))
const floors = JSON.parse(await readFile(FLOORS_PATH, 'utf8'))[`@stardust/${workspace}`]
const coveragePassed = (process.env.COVERAGE_OUTCOME ?? 'success') === 'success'
const runUrl = process.env.GITHUB_SERVER_URL
  ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
  : undefined

const rows = METRICS.map((metric) => {
  const result = summary.total?.[metric]
  if (!result) throw new Error(`Coverage summary is missing the ${metric} metric.`)
  const floor = floors?.[metric]
  if (typeof floor !== 'number') {
    throw new Error(`coverage-baseline.json is missing the ${metric} floor.`)
  }
  const label = metric[0].toUpperCase() + metric.slice(1)
  return `| ${label} | ${result.pct}% | ${floor}% | ${result.covered} / ${result.total} |`
})
const report = [
  `<!-- coverage-report:${workspace} -->`,
  `## ${WORKSPACES[workspace]} test coverage`,
  '',
  '| Metric | Coverage | Floor | Covered / Total |',
  '| --- | ---: | ---: | ---: |',
  ...rows,
  '',
  coveragePassed
    ? '✅ All coverage floors passed.'
    : '❌ Tests or coverage floors failed. This is a blocking CI result.',
  ...(runUrl ? ['', `[Open workflow run](${runUrl})`] : []),
  '',
].join('\n')

await mkdir(dirname(outputPath), { recursive: true })
await writeFile(outputPath, report)

if (process.env.GITHUB_STEP_SUMMARY) {
  await writeFile(process.env.GITHUB_STEP_SUMMARY, report, { flag: 'a' })
}
