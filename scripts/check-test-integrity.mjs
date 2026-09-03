import { execFile } from 'node:child_process'
import { lstat, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'

const DEFAULT_BASE = 'main'
const execFileAsync = promisify(execFile)
const TEST_PATH_PATTERN = /(?:^|\/)(?:tests?\/|[^/]+\.(?:test|spec)\.[cm]?[jt]sx?)$/
const SOURCE_PATH_PATTERN = /^(?:apps|packages)\/([^/]+)\/src\/.*\.[cm]?[jt]sx?$/
const ALLOWED_TEST_PATH_PATTERNS = [
  /^scripts\/tests\/[^/]+\.(?:test|spec)\.[cm]?[jt]sx?$/,
  /^apps\/server\/src\/tests\/routes(?:\/|$)/,
  /^apps\/server\/src\/app\/hono\/routers\/(?:[^/]+\/)*tests(?:\/|$)/,
  /^apps\/web\/src\/app\/.*\/tests(?:\/|$)/,
  /^(?:apps|packages)\/[^/]+\/src\/(?:[^/]+\/)*domain\/(?:entities|structures|aggregates)\/tests(?:\/|$)/,
  /^(?:apps|packages)\/[^/]+\/src\/(?:[^/]+\/)*use-cases\/tests(?:\/|$)/,
  /^apps\/(?:server|web)\/src\/rest\/controllers\/(?:[^/]+\/)*tests(?:\/|$)/,
  /^apps\/web\/src\/rpc\/actions\/(?:[^/]+\/)*tests(?:\/|$)/,
  /^apps\/(?:server|web)\/src\/ai\/(?:[^/]+\/)*tools\/(?:[^/]+\/)*tests(?:\/|$)/,
  /^apps\/server\/src\/queue\/jobs\/(?:[^/]+\/)*tests(?:\/|$)/,
  /^apps\/(?:web|studio)\/src\/ui\/(?:[^/]+\/)*hooks\/tests(?:\/|$)/,
  /^apps\/(?:web|studio)\/src\/ui\/(?:[^/]+\/)*widgets\/(?:[^/]+\/)*tests(?:\/|$)/,
  /^(?:apps|packages)\/[^/]+\/src\/[^/]+\.(?:test|spec)\.[cm]?[jt]sx?$/,
]
const NON_TESTABLE_SOURCE_PATTERNS = [
  /(?:^|\/)index\.[cm]?[jt]sx?$/,
  /(?:^|\/)(?:__mocks__|fakers?|fixtures?|mocks?|tests?)\//,
  /(?:^|\/)(?:generated|types?)\//,
  /(?:^|\/)supabase\/types\//,
  /\.(?:d|generated)\.[cm]?tsx?$/,
]
const TESTABLE_SOURCE_PATTERNS = [
  /(?:^|\/)domain\/(?:entities|structures|aggregates)\//,
  /(?:^|\/)use-cases\//,
  /(?:^|\/)rest\/controllers\//,
  /(?:^|\/)rpc\/actions\//,
  /(?:^|\/)ai\/(?:[^/]+\/)*tools\//,
  /(?:^|\/)app\/hono\/routers\//,
  /(?:^|\/)queue\/jobs\//,
  /(?:^|\/)ui\/(?:[^/]+\/)*hooks\//,
  /(?:^|\/)ui\/(?:[^/]+\/)*widgets\//,
  /(?:^|\/)app\/(?:.+\/)?(?:page|layout|route)\.[cm]?[jt]sx?$/,
  /(?:^|\/)[^/]+(?:Controller|Job|View|Hook|Route)\.[cm]?[jt]sx?$/,
]

function parseArguments(argumentsList) {
  const positionalArguments = []
  let base = DEFAULT_BASE
  let shouldPrintJson = false

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index]
    if (argument === '--') continue
    if (argument === '--help') return { shouldPrintHelp: true }
    if (argument === '--json') {
      shouldPrintJson = true
      continue
    }
    if (argument === '--base') {
      const baseArgument = argumentsList[index + 1]
      if (!baseArgument || baseArgument.startsWith('--')) {
        throw new Error('--base requires a Git ref')
      }
      base = baseArgument
      index += 1
      continue
    }
    if (argument.startsWith('--')) throw new Error(`Unknown option: ${argument}`)
    positionalArguments.push(argument)
  }

  if (positionalArguments.length > 0) {
    throw new Error('Usage: npm run check:test-integrity -- [--base <git-ref>] [--json]')
  }
  return { base, shouldPrintHelp: false, shouldPrintJson }
}

function printHelp() {
  console.log('Usage: npm run check:test-integrity -- [--base <git-ref>] [--json]')
  console.log(
    'Checks test weakening and missing tests for changed testable source files.',
  )
}

async function runGit(argumentsList, cwd) {
  const { stdout } = await execFileAsync('git', argumentsList, {
    cwd,
    encoding: 'buffer',
    maxBuffer: 20 * 1024 * 1024,
  })
  return stdout
}

function parseNullSeparated(output) {
  return output.toString('utf8').split('\0').filter(Boolean)
}

function parseChangedPaths(output) {
  const values = parseNullSeparated(output)
  const changedPaths = new Map()
  for (let index = 0; index < values.length; index += 2) {
    const status = values[index]
    const changedPath = values[index + 1]
    if (status && changedPath) changedPaths.set(changedPath, status)
  }
  return changedPaths
}

function isTestPath(filePath) {
  return TEST_PATH_PATTERN.test(filePath)
}

function isAllowedTestPath(filePath) {
  return ALLOWED_TEST_PATH_PATTERNS.some((pattern) => pattern.test(filePath))
}

function sourceWorkspace(filePath) {
  return filePath.match(SOURCE_PATH_PATTERN)?.[1]
}

function isTestableSourcePath(filePath) {
  if (!sourceWorkspace(filePath)) return false
  if (NON_TESTABLE_SOURCE_PATTERNS.some((pattern) => pattern.test(filePath))) return false
  return TESTABLE_SOURCE_PATTERNS.some((pattern) => pattern.test(filePath))
}

function countMatches(content, pattern) {
  return [...content.matchAll(pattern)].length
}

function testMetrics(content) {
  return {
    assertions: countMatches(content, /\bexpect\s*\(|\bassert\.[A-Za-z]+\s*\(/g),
    disabled: countMatches(content, /\b(?:it|test|describe)\.(?:skip|todo)\s*\(/g),
    cases: countMatches(content, /\b(?:it|test)(?:\.each)?\s*\(/g),
  }
}

async function inspectCurrentPath(repositoryRoot, filePath) {
  try {
    const stats = await lstat(path.join(repositoryRoot, filePath))
    return { exists: true, isDirectory: stats.isDirectory() }
  } catch (error) {
    if (error?.code === 'ENOENT') return { exists: false, isDirectory: false }
    throw error
  }
}

async function readBaseFile(repositoryRoot, baseSha, filePath) {
  try {
    return (await runGit(['show', `${baseSha}:${filePath}`], repositoryRoot)).toString(
      'utf8',
    )
  } catch {
    return null
  }
}

async function checkTestIntegrity({ base }) {
  const repositoryRoot = (await runGit(['rev-parse', '--show-toplevel'], process.cwd()))
    .toString('utf8')
    .trim()
  const baseSha = (
    await runGit(
      ['rev-parse', '--verify', '--end-of-options', `${base}^{commit}`],
      repositoryRoot,
    )
  )
    .toString('utf8')
    .trim()
  const [diffOutput, untrackedOutput] = await Promise.all([
    runGit(
      ['diff', '--name-status', '-z', '--no-renames', baseSha, '--'],
      repositoryRoot,
    ),
    runGit(['ls-files', '--others', '--exclude-standard', '-z'], repositoryRoot),
  ])
  const changedPaths = parseChangedPaths(diffOutput)
  for (const untrackedPath of parseNullSeparated(untrackedOutput)) {
    if (!changedPaths.has(untrackedPath)) changedPaths.set(untrackedPath, '??')
  }

  const errors = []
  const warnings = []
  const forbiddenTestPaths = []
  const changedTestPaths = new Set(
    [...changedPaths.entries()]
      .filter(([filePath, status]) => isTestPath(filePath) && status !== 'D')
      .map(([filePath]) => filePath),
  )

  for (const [filePath, status] of changedPaths) {
    if (!isTestPath(filePath)) continue
    if (status === 'D') continue
    if (!isAllowedTestPath(filePath)) {
      forbiddenTestPaths.push(filePath)
      errors.push(`${filePath}: test file is outside allowed test locations`)
    }
    const currentPath = await inspectCurrentPath(repositoryRoot, filePath)
    if (!currentPath.exists || currentPath.isDirectory) {
      errors.push(`${filePath}: changed test file is missing`)
      continue
    }
    if (!status.startsWith('M')) continue
    const baseContent = await readBaseFile(repositoryRoot, baseSha, filePath)
    if (baseContent === null) continue
    const before = testMetrics(baseContent)
    const after = testMetrics(await readFile(path.join(repositoryRoot, filePath), 'utf8'))
    if (after.cases < before.cases) {
      errors.push(`${filePath}: test cases decreased (${after.cases} < ${before.cases})`)
    }
    if (after.assertions < before.assertions) {
      errors.push(
        `${filePath}: assertions decreased (${after.assertions} < ${before.assertions})`,
      )
    }
    if (after.disabled > before.disabled) {
      errors.push(
        `${filePath}: disabled or todo tests increased (${after.disabled} > ${before.disabled})`,
      )
    }
  }

  const changedSourceCandidates = [...changedPaths.entries()]
    .map(([filePath, status]) => ({
      filePath,
      status,
      workspace: sourceWorkspace(filePath),
    }))
    .filter(
      ({ filePath, status, workspace }) =>
        workspace && status !== 'D' && !isTestPath(filePath),
    )
  const excludedSourcePaths = changedSourceCandidates
    .filter(({ filePath }) => !isTestableSourcePath(filePath))
    .map(({ filePath }) => filePath)
  const changedSourcePaths = changedSourceCandidates.filter(({ filePath }) =>
    isTestableSourcePath(filePath),
  )
  for (const { filePath, workspace } of changedSourcePaths) {
    const hasWorkspaceTest = [...changedTestPaths].some(
      (testPath) =>
        testPath.startsWith(`apps/${workspace}/`) ||
        testPath.startsWith(`packages/${workspace}/`),
    )
    if (!hasWorkspaceTest)
      warnings.push(`${filePath}: no changed test found in workspace ${workspace}`)
  }

  return {
    base,
    baseSha,
    changedTestPaths: changedTestPaths.size,
    errors,
    excludedSourcePaths,
    forbiddenTestPaths,
    status: errors.length === 0 && warnings.length === 0 ? 'passed' : 'failed',
    testableSourcePaths: changedSourcePaths.map(({ filePath }) => filePath),
    untestedSourcePaths: warnings.length,
    warnings,
  }
}

function printResult(result, shouldPrintJson) {
  if (shouldPrintJson) {
    console.log(JSON.stringify(result, null, 2))
    return
  }
  console.log(`Test integrity: ${result.status.toUpperCase()}`)
  console.log(`Baseline: ${result.base} (${result.baseSha})`)
  console.log(`Changed test files: ${result.changedTestPaths}`)
  console.log(`Testable source files: ${result.testableSourcePaths.length}`)
  console.log(`Excluded source files: ${result.excludedSourcePaths.length}`)
  for (const error of result.errors) console.error(`ERROR: ${error}`)
  for (const warning of result.warnings) console.error(`ERROR: ${warning}`)
  console.log(
    'Boundary: this checks test strength, allowed locations and changed-source pairing; coverage percentages are checked separately.',
  )
}

async function main() {
  try {
    const argumentsResult = parseArguments(process.argv.slice(2))
    if (argumentsResult.shouldPrintHelp) {
      printHelp()
      return
    }
    const result = await checkTestIntegrity(argumentsResult)
    printResult(result, argumentsResult.shouldPrintJson)
    process.exitCode = result.status === 'passed' ? 0 : 1
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 2
  }
}

await main()
