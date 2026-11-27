import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const SCRIPT_PATH = fileURLToPath(
  new URL('../write-coverage-report.mjs', import.meta.url),
)
const FLOORS = JSON.parse(
  await readFile(new URL('../../coverage-baseline.json', import.meta.url), 'utf8'),
)

async function createDirectory(context) {
  const directory = await mkdtemp(path.join(tmpdir(), 'stardust-coverage-report-'))
  context.after(() => rm(directory, { force: true, recursive: true }))
  return directory
}

test('writes the coverage and floors and appends them to the step summary', async (context) => {
  const directory = await createDirectory(context)
  const summaryPath = path.join(directory, 'coverage-summary.json')
  const outputPath = path.join(directory, 'nested', 'coverage-comment.md')
  const stepSummaryPath = path.join(directory, 'step-summary.md')
  const metric = (pct) => ({ pct, covered: pct, total: 100 })
  await writeFile(
    summaryPath,
    JSON.stringify({
      total: {
        statements: metric(91),
        branches: metric(82),
        functions: metric(88),
        lines: metric(90),
      },
    }),
  )

  await execFileAsync(process.execPath, [SCRIPT_PATH, 'web', summaryPath, outputPath], {
    env: {
      ...process.env,
      COVERAGE_OUTCOME: 'success',
      GITHUB_SERVER_URL: 'https://github.com',
      GITHUB_REPOSITORY: 'owner/repository',
      GITHUB_RUN_ID: '123',
      GITHUB_STEP_SUMMARY: stepSummaryPath,
    },
  })

  const report = await readFile(outputPath, 'utf8')
  const floors = FLOORS['@stardust/web']
  assert.match(report, /<!-- coverage-report:web -->\n## Web test coverage/)
  for (const row of [
    `| Statements | 91% | ${floors.statements}% | 91 / 100 |`,
    `| Branches | 82% | ${floors.branches}% | 82 / 100 |`,
    `| Functions | 88% | ${floors.functions}% | 88 / 100 |`,
    `| Lines | 90% | ${floors.lines}% | 90 / 100 |`,
  ]) {
    assert.ok(report.includes(row), row)
  }
  assert.match(report, /✅ All coverage floors passed\./)
  assert.match(
    report,
    /\[Open workflow run\]\(https:\/\/github\.com\/owner\/repository\/actions\/runs\/123\)/,
  )
  assert.equal(await readFile(stepSummaryPath, 'utf8'), report)
})

test('reports failed floors as blocking', async (context) => {
  const directory = await createDirectory(context)
  const summaryPath = path.join(directory, 'coverage-summary.json')
  const outputPath = path.join(directory, 'coverage-comment.md')
  const metric = { pct: 1, covered: 1, total: 100 }
  await writeFile(
    summaryPath,
    JSON.stringify({
      total: { statements: metric, branches: metric, functions: metric, lines: metric },
    }),
  )

  await execFileAsync(process.execPath, [SCRIPT_PATH, 'core', summaryPath, outputPath], {
    env: { ...process.env, COVERAGE_OUTCOME: 'failure', GITHUB_STEP_SUMMARY: '' },
  })

  assert.match(await readFile(outputPath, 'utf8'), /❌ Tests or coverage floors failed/)
})

test('fails on an unknown workspace or a missing metric', async (context) => {
  const directory = await createDirectory(context)
  const summaryPath = path.join(directory, 'coverage-summary.json')
  const outputPath = path.join(directory, 'coverage-comment.md')
  await writeFile(summaryPath, JSON.stringify({ total: {} }))
  const run = (workspace) =>
    execFileAsync(process.execPath, [SCRIPT_PATH, workspace, summaryPath, outputPath])

  await assert.rejects(run('web'), /missing the statements metric/)
  await assert.rejects(run('backoffice'), /Unknown coverage workspace/)
})
