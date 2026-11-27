import { execFileSync } from 'node:child_process'
import {
  appendFileSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { getUseCaseModule } from './mutation-targets.mjs'

const USAGE =
  'Usage: node scripts/check-mutation-score.mjs <candidate-reports> --baseline-root <reports> --base-ref <ref> --head-ref <ref> [--threshold 70] [--shards 4] [--output <path>] [--comment-output <path>]'
// Same classification as Stryker's mutation score: timeouts are detected, uncovered
// mutants are undetected, and ignored or invalid mutants are not scored.
const STATUS_COUNTERS = {
  Killed: 'killed',
  Timeout: 'timeout',
  Survived: 'survived',
  NoCoverage: 'noCoverage',
  Ignored: 'ignored',
  RuntimeError: 'errors',
  CompileError: 'errors',
}
const COUNTERS = ['killed', 'timeout', 'survived', 'noCoverage', 'ignored', 'errors']

function createResult() {
  return Object.fromEntries(COUNTERS.map((counter) => [counter, 0]))
}

function addResult(target, source) {
  for (const counter of COUNTERS) target[counter] += source[counter]
}

function totalMutants(result) {
  return COUNTERS.reduce((total, counter) => total + result[counter], 0)
}

function detected(result) {
  return result.killed + result.timeout
}

function scored(result) {
  return detected(result) + result.survived + result.noCoverage
}

function ratio(result) {
  return !result || scored(result) === 0 ? null : detected(result) / scored(result)
}

function meets(result, threshold) {
  const score = ratio(result)
  return score !== null && score * 100 >= threshold
}

// Compares exact ratios, so rounding never hides a drop.
function holds(current, previous) {
  return (
    ratio(current) !== null &&
    detected(current) * scored(previous) >= detected(previous) * scored(current)
  )
}

function formatScore(result) {
  const score = ratio(result)
  return score === null ? 'N/A' : `${(score * 100).toFixed(2)}%`
}

export function collectReports(root, shards) {
  const reports = readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name === 'mutation.json')
    .map((entry) => join(entry.parentPath, entry.name))
    .sort()
  if (reports.length !== shards) {
    throw new Error(
      `Expected ${shards} mutation.json reports in ${root}; found ${reports.length}.`,
    )
  }
  return reports
}

function scoreFile(path, file) {
  if (!Array.isArray(file?.mutants)) {
    throw new Error(`Mutation file ${path} must contain a mutants array.`)
  }
  const result = createResult()
  for (const mutant of file.mutants) {
    if (typeof mutant?.status !== 'string' || !mutant.status) {
      throw new Error(`Mutation file ${path} has a mutant without a status.`)
    }
    // An unknown or unfinished status counts as an undetected survivor.
    result[STATUS_COUNTERS[mutant.status] ?? 'survived'] += 1
  }
  return result
}

export function readFileScores(reportPaths) {
  const files = new Map()
  for (const reportPath of reportPaths) {
    const report = JSON.parse(readFileSync(reportPath, 'utf8'))
    if (!report?.files || typeof report.files !== 'object') {
      throw new Error(`Mutation report ${reportPath} must contain a files object.`)
    }
    for (const [sourcePath, file] of Object.entries(report.files)) {
      const path = sourcePath.replaceAll('\\', '/').replace(/^.*?(?=src\/)/, '')
      if (!getUseCaseModule(path)) {
        throw new Error(`Mutation report has a file outside the scope: ${sourcePath}.`)
      }
      if (files.has(path)) {
        throw new Error(`Duplicate mutation file across shard reports: ${path}.`)
      }
      files.set(path, scoreFile(path, file))
    }
  }
  return files
}

export function groupByModule(files) {
  const modules = new Map()
  for (const [path, result] of files) {
    const name = getUseCaseModule(path)
    if (!modules.has(name)) modules.set(name, createResult())
    addResult(modules.get(name), result)
  }
  return modules
}

// A module must reach the threshold; one already below it must not drop.
export function compareModules(candidate, baseline, threshold) {
  const names = [...new Set([...candidate.keys(), ...baseline.keys()])].sort()
  return names.map((name) => {
    const current = candidate.get(name)
    const previous = baseline.get(name)
    // Its files are still compared one by one, so a lost report cannot hide here.
    if (!current) return { name, current, previous, result: 'PASS (removed)' }
    if (meets(current, threshold)) return { name, current, previous, result: 'PASS' }
    const isBelow = ratio(previous) !== null && !meets(previous, threshold)
    const result = isBelow && holds(current, previous) ? 'PASS (no drop)' : 'FAIL'
    return { name, current, previous, result }
  })
}

function judgeChangedFile(current, previous, status, threshold) {
  if (status === 'D') return { passed: true, policy: 'deleted' }
  if (!current) return { passed: false, policy: 'missing candidate data' }
  if (totalMutants(current) === 0) return { passed: true, policy: 'no mutants' }
  const isBelow =
    status !== 'A' && ratio(previous) !== null && !meets(previous, threshold)
  if (isBelow) {
    return {
      passed: meets(current, threshold) || holds(current, previous),
      policy: 'changed below threshold: no drop',
    }
  }
  return { passed: meets(current, threshold), policy: 'new or changed: threshold' }
}

function judgeUnchangedFile(current, previous, threshold) {
  if (!current || !previous) {
    const side = current ? 'baseline' : 'candidate'
    return { passed: false, policy: `missing ${side} data` }
  }
  if (totalMutants(current) === 0 && totalMutants(previous) === 0) {
    return { passed: true, policy: 'no mutants' }
  }
  const passed =
    ratio(previous) === null ? meets(current, threshold) : holds(current, previous)
  return { passed, policy: 'unchanged: no drop' }
}

export function compareFiles(candidate, baseline, changed, threshold) {
  const paths = new Set([...candidate.keys(), ...baseline.keys(), ...changed.keys()])
  return [...paths].sort().map((path) => {
    const current = candidate.get(path)
    const previous = baseline.get(path)
    const verdict = changed.has(path)
      ? judgeChangedFile(current, previous, changed.get(path), threshold)
      : judgeUnchangedFile(current, previous, threshold)
    return { path, current, previous, ...verdict }
  })
}

// Parses `git diff --no-renames --name-status -z` into package paths and statuses.
export function parseChangedFiles(output) {
  const fields = output.split('\0').filter(Boolean)
  const changed = new Map()
  for (let index = 0; index < fields.length; index += 2) {
    const [status, path] = [fields[index], fields[index + 1]]
    if (!path || !/^[ADMT]$/.test(status)) {
      throw new Error(`Unexpected git diff entry: ${status} ${path ?? ''}`)
    }
    const local = path.replace(/^packages\/core\//, '')
    if (getUseCaseModule(local)) changed.set(local, status)
  }
  return changed
}

function readChangedFiles(base, head) {
  const argumentsList = ['diff', '--no-renames', '--name-status', '-z', base, head]
  return parseChangedFiles(
    execFileSync('git', [...argumentsList, '--', 'packages/core/src'], {
      encoding: 'utf8',
    }),
  )
}

function fileTable(rows) {
  return [
    '| File | Policy | Target branch | Candidate | Result |',
    '| --- | --- | ---: | ---: | --- |',
    ...rows.map(
      ({ path, policy, previous, current, passed }) =>
        `| ${path} | ${policy} | ${formatScore(previous)} | ${formatScore(current)} | ${passed ? 'PASS' : 'FAIL'} |`,
    ),
  ]
}

export function renderModules(modules, threshold) {
  return [
    '## Core mutation score by module',
    '',
    `A module must score at least ${threshold}%; a module already below it on the target branch must not drop. Score = (killed + timeout) / (all mutants except Ignored, RuntimeError and CompileError). Uncovered mutants count against the score.`,
    '',
    '| Module | Killed | Timeout | Survived | NoCoverage | Ignored | Errors | Total | Target branch | Candidate | Result |',
    '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |',
    ...modules.map(({ name, current = createResult(), previous, result }) => {
      const counts = COUNTERS.map((counter) => current[counter]).join(' | ')
      return `| ${name} | ${counts} | ${totalMutants(current)} | ${formatScore(previous)} | ${formatScore(current)} | ${result} |`
    }),
    '',
  ].join('\n')
}

export function renderFiles(files, threshold) {
  return [
    '## Core mutation score by use-case file',
    '',
    `New files, and changed files that were at or above ${threshold}%, must score at least ${threshold}%. Changed files already below it must not drop, unless they reach it. Unchanged files must not drop. Scores are compared without rounding.`,
    '',
    ...fileTable(files),
    '',
  ].join('\n')
}

export function isPassing(modules, files) {
  return (
    files.every((file) => file.passed) && modules.every(({ result }) => result !== 'FAIL')
  )
}

// The comment lists only the failing files; the full table goes to the artifact.
export function renderComment(modules, files, threshold, runUrl) {
  const failed = files.filter((file) => !file.passed)
  return [
    '<!-- mutation-report:core -->',
    renderModules(modules, threshold),
    isPassing(modules, files)
      ? '✅ The mutation score gate passed.'
      : '❌ The mutation score gate failed.',
    '',
    ...(failed.length ? ['### Failing files', '', ...fileTable(failed), ''] : []),
    ...(runUrl ? [`[Open workflow run](${runUrl})`, ''] : []),
  ].join('\n')
}

function parseThreshold(value) {
  if (!/^\d+(\.\d+)?$/.test(value) || Number(value) > 100) {
    throw new Error('Threshold must be a number from 0 to 100.')
  }
  return Number(value)
}

export function parseArguments(argumentsList) {
  const names = {
    '--baseline-root': 'baselineRoot',
    '--base-ref': 'baseRef',
    '--head-ref': 'headRef',
    '--threshold': 'threshold',
    '--shards': 'shards',
    '--output': 'output',
    '--comment-output': 'commentOutput',
  }
  const [root, ...flags] = argumentsList
  const options = { root, threshold: '70', shards: '4' }
  for (let index = 0; index < flags.length; index += 2) {
    const name = names[flags[index]]
    if (!name || !flags[index + 1]) throw new Error(USAGE)
    options[name] = flags[index + 1]
  }
  const { baselineRoot, baseRef, headRef } = options
  if (!root || root.startsWith('--') || !baselineRoot || !baseRef || !headRef) {
    throw new Error(USAGE)
  }
  const shards = Number(options.shards)
  if (!Number.isInteger(shards) || shards < 1) throw new Error(USAGE)
  return { ...options, shards, threshold: parseThreshold(options.threshold) }
}

function write(path, content) {
  mkdirSync(dirname(resolve(path)), { recursive: true })
  writeFileSync(path, content)
}

function main() {
  const options = parseArguments(process.argv.slice(2))
  const { threshold, shards } = options
  const candidate = readFileScores(collectReports(options.root, shards))
  const baseline = readFileScores(collectReports(options.baselineRoot, shards))
  const modules = compareModules(
    groupByModule(candidate),
    groupByModule(baseline),
    threshold,
  )
  const changed = readChangedFiles(options.baseRef, options.headRef)
  const files = compareFiles(candidate, baseline, changed, threshold)
  const report = `${renderModules(modules, threshold)}\n${renderFiles(files, threshold)}`
  const runUrl = process.env.GITHUB_SERVER_URL
    ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    : undefined
  const comment = renderComment(modules, files, threshold, runUrl)
  if (options.output) write(options.output, report)
  if (options.commentOutput) write(options.commentOutput, comment)
  process.stdout.write(comment)
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\n${report}`)
  }
  if (!isPassing(modules, files)) process.exitCode = 1
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(`Core mutation score: ${error.message}`)
    process.exitCode = 1
  }
}
