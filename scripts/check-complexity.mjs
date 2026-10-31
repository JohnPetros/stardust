import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { spawnSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'

const SCRIPT_DIRECTORY = path.dirname(fileURLToPath(import.meta.url))
const ROOT_DIRECTORY = path.resolve(SCRIPT_DIRECTORY, '..')
const BASELINE_PATH = path.join(ROOT_DIRECTORY, '.code-multivitals-baseline.json')
const CONFIG_PATH = path.join(ROOT_DIRECTORY, '.code-multivitals.json')
const CODE_MULTIVITALS_PATH = path.join(
  ROOT_DIRECTORY,
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'code-multivitals.cmd' : 'code-multivitals',
)
const EXCLUDE_PATTERNS = [
  '!**/*.test.ts',
  '!**/*.test.tsx',
  '!**/tests/**',
  '!**/routeTree.gen.ts',
  '!apps/server/src/database/supabase/types/Database.ts',
]
const SOURCE_PATTERNS = [
  'apps/server/src/**/*.ts',
  'apps/web/src/**/*.{ts,tsx}',
  'apps/backoffice/src/**/*.{ts,tsx}',
  'packages/core/src/**/*.ts',
  'packages/validation/src/**/*.ts',
  'packages/email/templates/**/*.{ts,tsx}',
  'packages/lsp/src/**/*.ts',
  ...EXCLUDE_PATTERNS,
]
const SOURCE_PATTERNS_BY_SCOPE = {
  'apps/server': ['apps/server/src/**/*.ts'],
  'apps/web': ['apps/web/src/**/*.{ts,tsx}'],
  'apps/backoffice': ['apps/backoffice/src/**/*.{ts,tsx}'],
  'packages/core': ['packages/core/src/**/*.ts'],
  'packages/validation': ['packages/validation/src/**/*.ts'],
  'packages/email': ['packages/email/templates/**/*.{ts,tsx}'],
  'packages/lsp': ['packages/lsp/src/**/*.ts'],
}

function toRepositoryPath(filePath) {
  return path
    .relative(ROOT_DIRECTORY, path.resolve(ROOT_DIRECTORY, filePath))
    .split(path.sep)
    .join('/')
}

function toAbsolutePath(filePath) {
  return path.resolve(ROOT_DIRECTORY, filePath)
}

function getWorstSeverity(functionResult) {
  const severities = [
    functionResult.maintainabilityRating,
    ...functionResult.metrics.map((metric) => metric.severity),
  ]
  if (severities.includes('error')) return 'error'
  if (severities.includes('warn')) return 'warn'
  return 'ok'
}

function isBaselineViolation(functionResult) {
  return getWorstSeverity(functionResult) !== 'ok'
}

function mapClonePaths(clone) {
  return {
    ...clone,
    blockA: { ...clone.blockA, filePath: toRepositoryPath(clone.blockA.filePath) },
    blockB: { ...clone.blockB, filePath: toRepositoryPath(clone.blockB.filePath) },
  }
}

function normalizeBaseline(baseline, previousBaseline = { files: [] }) {
  const previousOrder = new Map(
    previousBaseline.files.map((file, index) => [file.filePath, index]),
  )
  return {
    ...baseline,
    files: baseline.files
      .map((file) => ({
        ...file,
        filePath: toRepositoryPath(file.filePath),
        functions: file.functions.filter(isBaselineViolation),
      }))
      .filter((file) => file.functions.length > 0)
      .sort(
        (left, right) =>
          (previousOrder.get(left.filePath) ?? Infinity) -
            (previousOrder.get(right.filePath) ?? Infinity) ||
          left.filePath.localeCompare(right.filePath),
      ),
    clones: baseline.clones.map(mapClonePaths),
  }
}

function materializeBaseline(baseline) {
  return {
    ...baseline,
    files: baseline.files.map((file) => ({
      ...file,
      filePath: toAbsolutePath(file.filePath),
    })),
    clones: baseline.clones.map(mapClonePaths).map((clone) => ({
      ...clone,
      blockA: { ...clone.blockA, filePath: toAbsolutePath(clone.blockA.filePath) },
      blockB: { ...clone.blockB, filePath: toAbsolutePath(clone.blockB.filePath) },
    })),
  }
}

function alignBaselineLocations(baseline, current) {
  const currentFiles = new Map(current.files.map((file) => [file.filePath, file]))
  return {
    ...baseline,
    files: baseline.files.map((file) => ({
      ...file,
      functions: file.functions.map((fn) => {
        const matches =
          currentFiles
            .get(file.filePath)
            ?.functions.filter((candidate) => candidate.name === fn.name) ?? []
        const sameNameCount = file.functions.filter(
          (candidate) => candidate.name === fn.name,
        ).length
        if (fn.name === '<anonymous>' || sameNameCount !== 1 || matches.length !== 1)
          return fn
        const candidate = matches[0]
        // Only relocate unchanged metrics. New, ambiguous or worsened functions
        // must still be reported against the committed baseline.
        if (
          JSON.stringify(fn.metrics) !== JSON.stringify(candidate.metrics) ||
          fn.maintainabilityIndex !== candidate.maintainabilityIndex ||
          fn.maintainabilityRating !== candidate.maintainabilityRating
        )
          return fn
        return { ...fn, startLine: candidate.startLine, endLine: candidate.endLine }
      }),
    })),
  }
}

function createCliArguments(
  baselinePath,
  saveBaselinePath,
  sourcePatterns = SOURCE_PATTERNS,
) {
  const argumentsList = [
    ...sourcePatterns,
    '--config',
    CONFIG_PATH,
    '--max-errors',
    '0',
    '--max-warnings',
    '0',
    '--min-duplicate-lines',
    '999999',
  ]
  if (baselinePath) argumentsList.push('--baseline', baselinePath)
  if (saveBaselinePath) argumentsList.push('--save-baseline', saveBaselinePath)
  return argumentsList
}

function getScopePatterns(scope) {
  if (!scope) return SOURCE_PATTERNS
  const patterns = SOURCE_PATTERNS_BY_SCOPE[scope]
  if (!patterns) {
    throw new Error(
      `Unknown complexity scope "${scope}". Expected one of ${Object.keys(
        SOURCE_PATTERNS_BY_SCOPE,
      ).join(', ')}.`,
    )
  }
  return [...patterns, ...EXCLUDE_PATTERNS]
}

function readScope() {
  const scopeIndex = process.argv.indexOf('--scope')
  if (scopeIndex === -1) return undefined
  const scope = process.argv[scopeIndex + 1]
  if (!scope || scope.startsWith('--')) {
    throw new Error('The --scope option requires an app or package path.')
  }
  return scope
}

function runCodeMultiVitals(argumentsList) {
  if (!existsSync(CODE_MULTIVITALS_PATH)) {
    throw new Error(
      `Missing CodeMultiVitals executable at ${toRepositoryPath(CODE_MULTIVITALS_PATH)}. Run npm ci first.`,
    )
  }
  const result = spawnSync(CODE_MULTIVITALS_PATH, argumentsList, {
    cwd: ROOT_DIRECTORY,
    stdio: 'inherit',
  })
  if (result.error) throw result.error
  return result.status ?? 1
}

function updateBaseline(tempDirectory) {
  const temporaryBaselinePath = path.join(tempDirectory, 'baseline.json')
  runCodeMultiVitals([
    ...createCliArguments(null, temporaryBaselinePath),
    '--reporter',
    'json',
    '--output',
    path.join(tempDirectory, 'report.json'),
  ])
  if (!existsSync(temporaryBaselinePath)) {
    throw new Error('CodeMultiVitals did not produce a baseline file.')
  }
  const baseline = JSON.parse(readFileSync(temporaryBaselinePath, 'utf8'))
  const previousBaseline = existsSync(BASELINE_PATH)
    ? JSON.parse(readFileSync(BASELINE_PATH, 'utf8'))
    : undefined
  writeFileSync(
    BASELINE_PATH,
    `${JSON.stringify(normalizeBaseline(baseline, previousBaseline), null, 2)}\n`,
  )
  console.log(`CodeMultiVitals baseline updated at ${toRepositoryPath(BASELINE_PATH)}`)
}

function checkAgainstBaseline(tempDirectory) {
  if (!existsSync(BASELINE_PATH)) {
    throw new Error(
      `Missing ${toRepositoryPath(BASELINE_PATH)}. Run npm run update:complexity-baseline first.`,
    )
  }
  const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'))
  const sourcePatterns = getScopePatterns(readScope())
  const currentPath = path.join(tempDirectory, 'current.json')
  runCodeMultiVitals([
    ...createCliArguments(null, null, sourcePatterns),
    '--reporter',
    'json',
    '--output',
    currentPath,
  ])
  if (!existsSync(currentPath)) {
    throw new Error('CodeMultiVitals did not produce the current analysis.')
  }
  const current = JSON.parse(readFileSync(currentPath, 'utf8'))
  const temporaryBaselinePath = path.join(tempDirectory, 'baseline.json')
  writeFileSync(
    temporaryBaselinePath,
    `${JSON.stringify(alignBaselineLocations(materializeBaseline(baseline), current), null, 2)}\n`,
  )
  return runCodeMultiVitals(
    createCliArguments(temporaryBaselinePath, null, getScopePatterns(readScope())),
  )
}

function main() {
  const shouldUpdateBaseline = process.argv.includes('--update-baseline')
  const scope = readScope()
  if (shouldUpdateBaseline && scope) {
    throw new Error(
      'The shared complexity baseline cannot be updated for a single scope. Omit --scope.',
    )
  }
  const temporaryDirectory = mkdtempSync(
    path.join(os.tmpdir(), 'stardust-code-multivitals-'),
  )
  try {
    if (shouldUpdateBaseline) {
      updateBaseline(temporaryDirectory)
      return 0
    }
    return checkAgainstBaseline(temporaryDirectory)
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true })
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    process.exitCode = main()
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  }
}

export {
  alignBaselineLocations,
  createCliArguments,
  getScopePatterns,
  materializeBaseline,
  normalizeBaseline,
  toAbsolutePath,
  toRepositoryPath,
}
