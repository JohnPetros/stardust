import { execFileSync } from 'node:child_process'
import {
  appendFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { analyseFile, DEFAULT_THRESHOLDS } from 'code-multivitals'

const ROOT_DIRECTORY = fileURLToPath(new URL('..', import.meta.url))
const CONFIG_FILE = '.code-multivitals.json'
const SOURCE_SCOPES = {
  'apps/server': { directory: 'apps/server/src/', extension: /\.ts$/ },
  'apps/web': { directory: 'apps/web/src/', extension: /\.tsx?$/ },
  'apps/backoffice': { directory: 'apps/backoffice/src/', extension: /\.tsx?$/ },
  'packages/core': { directory: 'packages/core/src/', extension: /\.ts$/ },
  'packages/validation': { directory: 'packages/validation/src/', extension: /\.ts$/ },
  'packages/email': { directory: 'packages/email/templates/', extension: /\.tsx?$/ },
  'packages/lsp': { directory: 'packages/lsp/src/', extension: /\.ts$/ },
}
const EXCLUDED_SOURCE =
  /\.test\.tsx?$|\/tests\/|\/routeTree\.gen\.ts$|^apps\/server\/src\/database\/supabase\/types\/Database\.ts$/
// How much a metric that is already over its error limit may grow in one change.
const METRICS = {
  cyclomaticComplexity: { label: 'Cyclomatic complexity', growth: 0 },
  cognitiveComplexity: { label: 'Cognitive complexity', growth: 0 },
  functionLength: { label: 'Function length', growth: 0.1 },
  nestingDepth: { label: 'Nesting depth', growth: 0 },
  halsteadVolume: { label: 'Halstead volume', growth: 0.1 },
}
const USAGE =
  'Usage: node scripts/check-complexity.mjs [--scope <app-or-package-path>] [--base <git-ref>] [--head <git-ref>] [--output <path>]'

export function isProductionSource(path, scope) {
  const scopes = scope ? [SOURCE_SCOPES[scope]] : Object.values(SOURCE_SCOPES)
  return (
    !EXCLUDED_SOURCE.test(path) &&
    scopes.some(
      ({ directory, extension }) => path.startsWith(directory) && extension.test(path),
    )
  )
}

// Reads `git diff --name-status -z`: renames carry the old path and the new path.
export function parseNameStatus(output) {
  const fields = output.split('\0').filter(Boolean)
  const changes = []
  for (let index = 0; index < fields.length; ) {
    const status = fields[index][0]
    const hasTwoPaths = status === 'R' || status === 'C'
    const first = fields[index + 1]
    const second = hasTwoPaths ? fields[index + 2] : first
    changes.push({
      basePath: status === 'A' ? undefined : first,
      headPath: status === 'D' ? undefined : second,
    })
    index += hasTwoPaths ? 3 : 2
  }
  return changes
}

function measureDistance(previous, current) {
  return current.metrics.reduce(
    (total, metric, index) =>
      total + Math.abs(metric.value - previous.metrics[index].value) / metric.threshold,
    0,
  )
}

// Pairs functions of one file by name, never by line. Functions sharing a name pair with
// the closest measurements first, so unchanged ones always find themselves.
export function pairFunctions(before, after) {
  const candidates = after.flatMap((current) =>
    before
      .filter((previous) => previous.name === current.name)
      .map((previous) => ({
        current,
        previous,
        distance: measureDistance(previous, current),
        offset: Math.abs(previous.startLine - current.startLine),
      })),
  )
  candidates.sort((a, b) => a.distance - b.distance || a.offset - b.offset)
  const pairs = new Map()
  const paired = new Set()
  for (const { current, previous } of candidates) {
    if (pairs.has(current) || paired.has(previous)) continue
    pairs.set(current, previous)
    paired.add(previous)
  }
  return pairs
}

function judgeMetric(metric, previous) {
  if (previous?.severity === 'error') {
    const allowed = previous.value * (1 + METRICS[metric.name].growth)
    if (metric.value <= allowed) return undefined
    return { allowed, reason: 'Already over the error limit and grew' }
  }
  if (metric.severity !== 'error') return undefined
  return {
    allowed: metric.threshold,
    reason: previous ? 'Went over the error limit' : 'New function over the error limit',
  }
}

export function compareFunctions(before, after) {
  const pairs = pairFunctions(before, after)
  const violations = []
  const warnings = []
  for (const current of after) {
    for (const metric of current.metrics) {
      const previous = pairs
        .get(current)
        ?.metrics.find(({ name }) => name === metric.name)
      const result = {
        name: current.name,
        line: current.startLine,
        metric: metric.name,
        before: previous?.value,
        after: metric.value,
      }
      const violation = judgeMetric(metric, previous)
      if (violation) violations.push({ ...result, ...violation })
      else if (metric.severity === 'warn' && (previous?.severity ?? 'ok') === 'ok') {
        warnings.push(result)
      }
    }
  }
  return { violations, warnings }
}

function runGit(root, argumentsList) {
  return execFileSync('git', ['-c', 'core.quotePath=false', ...argumentsList], {
    cwd: root,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
    stdio: ['ignore', 'pipe', 'pipe'],
  })
}

function findMergeBase(root, base, head) {
  try {
    return runGit(root, ['merge-base', base, head ?? 'HEAD']).trim()
  } catch {
    throw new Error(
      `Cannot find the merge base of ${base} and ${head ?? 'HEAD'}. Fetch the target branch or pass --base.`,
    )
  }
}

// Without a head revision the working tree is compared, including untracked files.
function listChanges(root, base, head) {
  const revisions = head ? [base, head] : [base]
  const changes = parseNameStatus(
    runGit(root, [
      'diff',
      '--name-status',
      '--find-renames',
      '--no-ext-diff',
      '-z',
      ...revisions,
      '--',
    ]),
  )
  if (head) return changes
  const untracked = runGit(root, ['ls-files', '--others', '--exclude-standard', '-z'])
  return [
    ...changes,
    ...untracked
      .split('\0')
      .filter(Boolean)
      .map((path) => ({ basePath: undefined, headPath: path })),
  ]
}

function readThresholds(root) {
  const config = JSON.parse(readFileSync(join(root, CONFIG_FILE), 'utf8'))
  return { ...DEFAULT_THRESHOLDS, ...config.thresholds }
}

// The analyser reads from disk, so each revision of a file gets its own copy.
function analyseSource({ directory, thresholds }, side, path, source) {
  const copy = join(directory, side, path)
  mkdirSync(dirname(copy), { recursive: true })
  writeFileSync(copy, source)
  return analyseFile(copy, thresholds)
}

// A change must never pass unmeasured, so unreadable code fails the gate.
function measureHead(analysis, path, source) {
  const report = analyseSource(analysis, 'head', path, source)
  if (report.parseError) {
    throw new Error(
      `Cannot parse ${path}. The analyser reads every file as TSX, so write a generic arrow as \`<T,>() => {}\`.\n${report.parseError}`,
    )
  }
  return report.functions
}

export function checkComplexity({ root = ROOT_DIRECTORY, scope, base, head }) {
  const mergeBase = findMergeBase(root, base, head)
  const changes = listChanges(root, mergeBase, head).filter(
    ({ headPath }) => headPath && isProductionSource(headPath, scope),
  )
  const directory = mkdtempSync(join(tmpdir(), 'stardust-complexity-'))
  const analysis = { directory, thresholds: readThresholds(root) }
  const result = { mergeBase, files: changes.length, violations: [], warnings: [] }
  try {
    for (const { basePath, headPath } of changes) {
      // A file that was not readable production source before has no functions to
      // compare with, so everything in it counts as new.
      const before =
        basePath && isProductionSource(basePath)
          ? analyseSource(
              analysis,
              'base',
              basePath,
              runGit(root, ['show', `${mergeBase}:${basePath}`]),
            ).functions
          : []
      const after = measureHead(
        analysis,
        headPath,
        head
          ? runGit(root, ['show', `${head}:${headPath}`])
          : readFileSync(join(root, headPath), 'utf8'),
      )
      const comparison = compareFunctions(before, after)
      for (const key of ['violations', 'warnings']) {
        result[key].push(...comparison[key].map((item) => ({ path: headPath, ...item })))
      }
    }
  } finally {
    rmSync(directory, { recursive: true, force: true })
  }
  return result
}

function formatValue(value) {
  return value === undefined ? '—' : String(Math.floor(value * 100) / 100)
}

function renderLocation({ path, line, name }) {
  return `| ${path}:${line} | \`${name}\` |`
}

function renderTitle(scope) {
  return `## Complexity: ${scope ?? 'all workspaces'}`
}

export function renderFailure(scope, message) {
  return [
    renderTitle(scope),
    '',
    '**FAIL**: the gate could not measure the change.',
    '',
    '```text',
    message,
    '```',
    '',
  ].join('\n')
}

export function renderComplexity(scope, result) {
  const { mergeBase, files, violations, warnings } = result
  const summary = violations.length
    ? `**FAIL**: ${violations.length} blocking result(s).`
    : '**PASS**'
  const violationRows = violations.map(
    (item) =>
      `${renderLocation(item)} ${METRICS[item.metric].label} | ${formatValue(item.before)} | ${formatValue(item.after)} | ≤ ${formatValue(item.allowed)} | ${item.reason} |`,
  )
  const warningRows = warnings.map(
    (item) =>
      `${renderLocation(item)} ${METRICS[item.metric].label} | ${formatValue(item.before)} | ${formatValue(item.after)} |`,
  )
  return [
    renderTitle(scope),
    '',
    `Compared ${files} changed source file(s) with ${mergeBase.slice(0, 8)}.`,
    '',
    summary,
    '',
    ...(violationRows.length
      ? [
          '| File | Function | Metric | Before | After | Allowed | Reason |',
          '| --- | --- | --- | ---: | ---: | ---: | --- |',
          ...violationRows,
          '',
        ]
      : []),
    ...(warningRows.length
      ? [
          `<details><summary>${warningRows.length} new warning(s), not blocking</summary>`,
          '',
          '| File | Function | Metric | Before | After |',
          '| --- | --- | --- | ---: | ---: |',
          ...warningRows,
          '',
          '</details>',
          '',
        ]
      : []),
  ].join('\n')
}

export function parseArguments(argumentsList) {
  const options = { base: 'origin/main' }
  const rest = argumentsList.filter((argument) => argument !== '--')
  for (let index = 0; index < rest.length; index += 2) {
    const [flag, value] = [rest[index], rest[index + 1]]
    if (!value || value.startsWith('--')) throw new Error(USAGE)
    if (flag === '--scope') options.scope = value
    else if (flag === '--base') options.base = value
    else if (flag === '--head') options.head = value
    else if (flag === '--output') options.output = value
    else throw new Error(`Unknown option: ${flag}\n${USAGE}`)
  }
  if (options.scope && !SOURCE_SCOPES[options.scope]) {
    throw new Error(
      `Unknown complexity scope "${options.scope}". Expected one of ${Object.keys(SOURCE_SCOPES).join(', ')}.`,
    )
  }
  return options
}

// The output file and the `findings` step output drive the pull-request comment.
function publishReport({ output }, markdown, hasFindings) {
  process.stdout.write(markdown)
  if (output) {
    mkdirSync(dirname(resolve(output)), { recursive: true })
    writeFileSync(output, markdown)
  }
  const { GITHUB_OUTPUT, GITHUB_STEP_SUMMARY } = process.env
  if (GITHUB_STEP_SUMMARY) appendFileSync(GITHUB_STEP_SUMMARY, `\n${markdown}`)
  if (GITHUB_OUTPUT) appendFileSync(GITHUB_OUTPUT, `findings=${hasFindings}\n`)
}

function main() {
  const options = parseArguments(process.argv.slice(2))
  let result
  try {
    result = checkComplexity(options)
  } catch (error) {
    publishReport(options, renderFailure(options.scope, error.message), true)
    throw error
  }
  const { violations, warnings } = result
  const hasFindings = violations.length + warnings.length > 0
  publishReport(options, renderComplexity(options.scope, result), hasFindings)
  if (violations.length) process.exitCode = 1
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(`Complexity: ${error.message}`)
    process.exitCode = 1
  }
}
