import { execFileSync } from 'node:child_process'
import { appendFileSync, mkdirSync, readFileSync } from 'node:fs'
import { dirname, isAbsolute, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SOURCE_ROOTS = {
  core: 'packages/core/src',
  server: 'apps/server/src',
  web: 'apps/web/src',
}
const DEFAULT_THRESHOLDS = { lines: 80, branches: 70 }
const USAGE =
  'Usage: node scripts/check-changed-coverage.mjs <core|server|web> <lcov-path> --base <git-ref> [--head <git-ref> | --working-tree] [--lines 80] [--branches 70] [--output <path>]'

export function parseLcov(content, root = process.cwd()) {
  const files = new Map()
  let record
  for (const line of content.split(/\r?\n/)) {
    if (line.startsWith('SF:')) {
      const path = line.slice(3)
      const sourcePath = (isAbsolute(path) ? relative(root, path) : path).replaceAll(
        '\\',
        '/',
      )
      record = { lines: new Map(), branches: [] }
      files.set(sourcePath, record)
    } else if (record && line.startsWith('DA:')) {
      const [number, hits] = line.slice(3).split(',')
      record.lines.set(Number(number), Number(hits))
    } else if (record && line.startsWith('BRDA:')) {
      const fields = line.slice(5).split(',')
      const taken = fields.at(-1)
      record.branches.push({ line: Number(fields[0]), taken: Number(taken) > 0 })
    } else if (line === 'end_of_record') record = undefined
  }
  return files
}

// Reads a zero-context unified diff and returns the added or modified line numbers.
export function parseChangedLines(diff) {
  const files = new Map()
  let lines
  let isHeader = false
  for (const line of diff.split('\n')) {
    if (line.startsWith('diff --git ')) {
      isHeader = true
      lines = undefined
    } else if (isHeader && line.startsWith('+++ ')) {
      const path = line.slice(4).replace(/\t$/, '')
      if (path === '/dev/null') continue
      lines = new Set()
      files.set(path.replace(/^b\//, ''), lines)
    } else if (line.startsWith('@@')) {
      isHeader = false
      const match = line.match(/^@@ -\S+ \+(\d+)(?:,(\d+))? @@/)
      if (!lines || !match) continue
      const first = Number(match[1])
      const count = match[2] === undefined ? 1 : Number(match[2])
      for (let number = first; number < first + count; number += 1) lines.add(number)
    }
  }
  return files
}

export function measureChangedCoverage(coverage, changed, sourceRoot) {
  if (![...coverage.keys()].some((path) => path.startsWith(`${sourceRoot}/`))) {
    throw new Error(`Coverage report has no files under ${sourceRoot}.`)
  }
  const totals = {
    lines: { covered: 0, total: 0 },
    branches: { covered: 0, total: 0 },
  }
  const gaps = []
  for (const [path, changedLines] of [...changed].sort(([a], [b]) =>
    a.localeCompare(b),
  )) {
    // Files the coverage config excludes (tests, fakers, barrels) have no record.
    const record = path.startsWith(`${sourceRoot}/`) ? coverage.get(path) : undefined
    if (!record) continue
    const uncoveredLines = new Set()
    for (const number of changedLines) {
      const hits = record.lines.get(number)
      if (hits === undefined) continue
      totals.lines.total += 1
      if (hits > 0) totals.lines.covered += 1
      else uncoveredLines.add(number)
    }
    const partialLines = new Set()
    for (const branch of record.branches) {
      if (!changedLines.has(branch.line)) continue
      totals.branches.total += 1
      if (branch.taken) totals.branches.covered += 1
      else partialLines.add(branch.line)
    }
    if (uncoveredLines.size || partialLines.size) {
      gaps.push({
        path,
        uncoveredLines: [...uncoveredLines].sort((a, b) => a - b),
        partialLines: [...partialLines].sort((a, b) => a - b),
      })
    }
  }
  return { totals, gaps }
}

// Untracked files have no diff, so every line in them is new.
export function addUntrackedLines(changed, paths, read) {
  for (const path of paths) {
    const count = read(path).split('\n').length
    changed.set(path, new Set(Array.from({ length: count }, (_, index) => index + 1)))
  }
  return changed
}

// Compares exact ratios; a metric with nothing to measure passes.
function passes({ covered, total }, threshold) {
  return total === 0 || covered * 100 >= threshold * total
}

export function renderChangedCoverage(workspace, result, thresholds) {
  const label = workspace[0].toUpperCase() + workspace.slice(1)
  const rows = Object.entries(result.totals).map(([metric, value]) => {
    const score = value.total
      ? `${((value.covered / value.total) * 100).toFixed(2)}%`
      : 'N/A'
    const name = metric[0].toUpperCase() + metric.slice(1)
    return `| ${name} | ${score} | ${thresholds[metric]}% | ${value.covered} / ${value.total} | ${passes(value, thresholds[metric]) ? 'PASS' : 'FAIL'} |`
  })
  const gaps = result.gaps.map(
    ({ path, uncoveredLines, partialLines }) =>
      `| ${path} | ${uncoveredLines.join(', ') || '—'} | ${partialLines.join(', ') || '—'} |`,
  )
  return [
    `## ${label} changed-lines coverage`,
    '',
    '| Metric | Coverage | Minimum | Covered / Total | Result |',
    '| --- | ---: | ---: | ---: | --- |',
    ...rows,
    '',
    ...(gaps.length
      ? [
          '<details><summary>Changed lines without full coverage</summary>',
          '',
          '| File | Uncovered lines | Lines with untaken branches |',
          '| --- | --- | --- |',
          ...gaps,
          '',
          '</details>',
          '',
        ]
      : []),
  ].join('\n')
}

function parseThreshold(value) {
  const threshold = Number(value)
  if (!/^\d+(?:\.\d+)?$/.test(value ?? '') || threshold > 100) {
    throw new Error('Threshold must be a number from 0 to 100.')
  }
  return threshold
}

export function parseArguments(argumentsList) {
  const [workspace, lcovPath, ...flags] = argumentsList
  const rest = flags.filter((flag) => flag !== '--working-tree')
  const options = { workspace, lcovPath, head: 'HEAD', ...DEFAULT_THRESHOLDS }
  if (rest.length !== flags.length) {
    if (rest.includes('--head')) throw new Error(USAGE)
    options.workingTree = true
  }
  for (let index = 0; index < rest.length; index += 2) {
    const [flag, value] = [rest[index], rest[index + 1]]
    if (value === undefined) throw new Error(USAGE)
    if (flag === '--base') options.base = value
    else if (flag === '--head') options.head = value
    else if (flag === '--output') options.output = value
    else if (flag === '--lines') options.lines = parseThreshold(value)
    else if (flag === '--branches') options.branches = parseThreshold(value)
    else throw new Error(`Unknown option: ${flag}`)
  }
  if (!SOURCE_ROOTS[workspace] || !lcovPath || !options.base) throw new Error(USAGE)
  return options
}

function git(argumentsList) {
  return execFileSync('git', ['-c', 'core.quotePath=false', ...argumentsList], {
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  })
}

function readChangedLines({ base, head, workingTree }, sourceRoot) {
  const diff = git([
    'diff',
    '--no-renames',
    '--no-ext-diff',
    '--src-prefix=a/',
    '--dst-prefix=b/',
    '--unified=0',
    base,
    ...(workingTree ? [] : [head]),
    '--',
    sourceRoot,
  ])
  const changed = parseChangedLines(diff)
  if (!workingTree) return changed
  const untracked = git([
    'ls-files',
    '--others',
    '--exclude-standard',
    '-z',
    '--',
    sourceRoot,
  ])
  return addUntrackedLines(changed, untracked.split('\0').filter(Boolean), (path) =>
    readFileSync(path, 'utf8'),
  )
}

function main() {
  const options = parseArguments(process.argv.slice(2))
  const sourceRoot = SOURCE_ROOTS[options.workspace]
  const result = measureChangedCoverage(
    parseLcov(readFileSync(options.lcovPath, 'utf8')),
    readChangedLines(options, sourceRoot),
    sourceRoot,
  )
  const markdown = renderChangedCoverage(options.workspace, result, options)
  process.stdout.write(markdown)
  if (options.output) {
    mkdirSync(dirname(resolve(options.output)), { recursive: true })
    appendFileSync(options.output, `\n${markdown}`)
  }
  if (process.env.GITHUB_STEP_SUMMARY) {
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `\n${markdown}`)
  }
  const isPassing = ['lines', 'branches'].every((metric) =>
    passes(result.totals[metric], options[metric]),
  )
  if (!isPassing) {
    console.error('Changed-lines coverage is below the minimum.')
    process.exitCode = 1
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(`Changed-lines coverage: ${error.message}`)
    process.exitCode = 1
  }
}
