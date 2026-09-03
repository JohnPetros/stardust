import { execFile } from 'node:child_process'
import { lstat, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'

const DEFAULT_BASE = 'main'
const ALLOWED_CHANGES = new Set(['Create', 'Generate', 'Modify', 'Remove'])
const execFileAsync = promisify(execFile)

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

  if (positionalArguments.length !== 1) {
    throw new Error(
      'Usage: npm run check:spec-implementation -- <documentation/features/.../spec.md|*-spec.md> [--base <git-ref>] [--json]',
    )
  }

  return {
    base,
    shouldPrintHelp: false,
    shouldPrintJson,
    specArgument: positionalArguments[0],
  }
}

function printHelp() {
  console.log(
    'Usage: npm run check:spec-implementation -- <documentation/features/.../spec.md|*-spec.md> [--base <git-ref>] [--json]',
  )
  console.log(
    'Checks every Create, Modify, Generate and Remove path in the Spec against Git and disk.',
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

/**
 * The first two cells are intentionally fixed. This is the machine-readable
 * contract required by create-spec-prompt.md; layer-specific columns follow.
 */
function parseAffectedPaths(markdown) {
  const affectedPaths = []
  const rowPattern = /^\|\s*`([^`]+)`\s*\|\s*([^|]+?)\s*\|/gm

  for (const match of markdown.matchAll(rowPattern)) {
    const change = match[2].trim()
    if (ALLOWED_CHANGES.has(change)) {
      affectedPaths.push({ change, path: match[1] })
    }
  }

  return affectedPaths
}

function validateAffectedPath(affectedPath) {
  if (
    !affectedPath ||
    affectedPath === '.' ||
    path.posix.isAbsolute(affectedPath) ||
    affectedPath.includes('\\') ||
    affectedPath.includes('\0') ||
    affectedPath.split('/').includes('..')
  ) {
    return 'must be a normalized repository-relative path'
  }
  if (/<[^>]+>/.test(affectedPath) || /[*?]/.test(affectedPath)) {
    return 'must be exact and cannot contain placeholders or wildcards'
  }
  return undefined
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

async function inspectCurrentPath(repositoryRoot, affectedPath) {
  try {
    const stats = await lstat(path.join(repositoryRoot, affectedPath))
    return { exists: true, isDirectory: stats.isDirectory() }
  } catch (error) {
    if (error?.code === 'ENOENT') return { exists: false, isDirectory: false }
    throw error
  }
}

function addClassificationFindings({
  affectedPath,
  basePaths,
  changedPaths,
  currentPath,
  currentTrackedPaths,
  errors,
  untrackedPaths,
}) {
  const { change, path: contractedPath } = affectedPath
  const existedAtBase = basePaths.has(contractedPath)
  const diffStatus = changedPaths.get(contractedPath)
  const isChanged = Boolean(diffStatus) || untrackedPaths.has(contractedPath)
  const isCurrentlyTracked = currentTrackedPaths.has(contractedPath)

  if (currentPath.isDirectory) {
    errors.push(`${contractedPath}: affected paths must identify files, not directories`)
    return
  }
  if (diffStatus?.includes('U')) {
    errors.push(`${contractedPath}: contains an unresolved Git conflict`)
    return
  }

  if (change === 'Create') {
    if (existedAtBase)
      errors.push(`${contractedPath}: Create path already exists at the baseline`)
    if (!currentPath.exists) errors.push(`${contractedPath}: Create path is missing`)
    else if (!isChanged)
      errors.push(
        `${contractedPath}: Create path exists but is not deliverable in the Git diff`,
      )
    return
  }

  if (change === 'Modify') {
    if (!existedAtBase)
      errors.push(`${contractedPath}: Modify path does not exist at the baseline`)
    if (!currentPath.exists) errors.push(`${contractedPath}: Modify path is missing`)
    else if (!isCurrentlyTracked)
      errors.push(`${contractedPath}: Modify path no longer remains tracked`)
    else if (!isChanged)
      errors.push(`${contractedPath}: Modify path is unchanged from the baseline`)
    return
  }

  if (change === 'Generate') {
    if (!currentPath.exists) errors.push(`${contractedPath}: Generate path is missing`)
    else if (existedAtBase && !isCurrentlyTracked)
      errors.push(`${contractedPath}: baseline Generate path no longer remains tracked`)
    else if (!isChanged)
      errors.push(`${contractedPath}: Generate path is unchanged from the baseline`)
    return
  }

  if (!existedAtBase)
    errors.push(`${contractedPath}: Remove path does not exist at the baseline`)
  if (currentPath.exists) errors.push(`${contractedPath}: Remove path still exists`)
  else if (diffStatus !== 'D')
    errors.push(`${contractedPath}: Remove path has no deletion in the Git diff`)
}

function isSpecPath(relativeSpecPath) {
  return /^documentation\/features\/.+\/(?:spec|[^/]+-spec)\.md$/.test(relativeSpecPath)
}

async function checkSpecImplementation({ base, specArgument }) {
  const repositoryRoot = (await runGit(['rev-parse', '--show-toplevel'], process.cwd()))
    .toString('utf8')
    .trim()
  const specPath = path.resolve(repositoryRoot, specArgument)
  const relativeSpecPath = path
    .relative(repositoryRoot, specPath)
    .replaceAll(path.sep, '/')

  if (relativeSpecPath.startsWith('../') || !isSpecPath(relativeSpecPath)) {
    throw new Error(
      'Spec must be a repository file under documentation/features/** and end in spec.md or -spec.md',
    )
  }

  const baseSha = (
    await runGit(
      ['rev-parse', '--verify', '--end-of-options', `${base}^{commit}`],
      repositoryRoot,
    )
  )
    .toString('utf8')
    .trim()
  const [markdown, baseOutput, diffOutput, trackedOutput, untrackedOutput] =
    await Promise.all([
      readFile(specPath, 'utf8'),
      runGit(['ls-tree', '-r', '-z', '--name-only', baseSha], repositoryRoot),
      runGit(
        ['diff', '--name-status', '-z', '--no-renames', baseSha, '--'],
        repositoryRoot,
      ),
      runGit(['ls-files', '-z', '--cached'], repositoryRoot),
      runGit(['ls-files', '--others', '--exclude-standard', '-z'], repositoryRoot),
    ])
  const affectedPaths = parseAffectedPaths(markdown)
  const basePaths = new Set(parseNullSeparated(baseOutput))
  const changedPaths = parseChangedPaths(diffOutput)
  const currentTrackedPaths = new Set(parseNullSeparated(trackedOutput))
  const untrackedPaths = new Set(parseNullSeparated(untrackedOutput))
  const errors = []
  const seenPaths = new Map()

  if (affectedPaths.length === 0)
    errors.push('Spec has no affected-path rows using Create, Modify, Generate or Remove')

  for (const affectedPath of affectedPaths) {
    const pathError = validateAffectedPath(affectedPath.path)
    if (pathError) {
      errors.push(`${affectedPath.path}: ${pathError}`)
      continue
    }
    const priorChange = seenPaths.get(affectedPath.path)
    if (priorChange) {
      errors.push(
        `${affectedPath.path}: contracted more than once (${priorChange}, ${affectedPath.change})`,
      )
      continue
    }
    seenPaths.set(affectedPath.path, affectedPath.change)
    const currentPath = await inspectCurrentPath(repositoryRoot, affectedPath.path)
    addClassificationFindings({
      affectedPath,
      basePaths,
      changedPaths,
      currentPath,
      currentTrackedPaths,
      errors,
      untrackedPaths,
    })
  }

  const contractedPaths = new Set(
    affectedPaths.map(({ path: contractedPath }) => contractedPath),
  )
  const allChangedPaths = new Set([...changedPaths.keys(), ...untrackedPaths])
  const unrelatedChangedPathsCount = [...allChangedPaths].filter(
    (changedPath) => !contractedPaths.has(changedPath),
  ).length
  const counts = Object.fromEntries(
    [...ALLOWED_CHANGES].map((change) => [
      change,
      affectedPaths.filter((affectedPath) => affectedPath.change === change).length,
    ]),
  )

  return {
    base,
    baseSha,
    counts,
    errors,
    pathsCount: affectedPaths.length,
    spec: relativeSpecPath,
    status: errors.length === 0 ? 'passed' : 'failed',
    unrelatedChangedPathsCount,
  }
}

function printResult(result, shouldPrintJson) {
  if (shouldPrintJson) {
    console.log(JSON.stringify(result, null, 2))
    return
  }
  console.log(`Spec path implementation: ${result.status.toUpperCase()}`)
  console.log(`Spec: ${result.spec}`)
  console.log(`Baseline: ${result.base} (${result.baseSha})`)
  console.log(
    `Contracted paths: ${result.pathsCount} (Create ${result.counts.Create}, Modify ${result.counts.Modify}, Generate ${result.counts.Generate}, Remove ${result.counts.Remove})`,
  )
  for (const error of result.errors) console.error(`ERROR: ${error}`)
  console.log(`Unrelated changed paths ignored: ${result.unrelatedChangedPathsCount}`)
  console.log(
    'Boundary: this proves contracted path and Git-state conformance, not semantic behavior or test correctness.',
  )
}

async function main() {
  try {
    const argumentsResult = parseArguments(process.argv.slice(2))
    if (argumentsResult.shouldPrintHelp) {
      printHelp()
      return
    }
    const result = await checkSpecImplementation(argumentsResult)
    printResult(result, argumentsResult.shouldPrintJson)
    process.exitCode = result.errors.length === 0 ? 0 : 1
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 2
  }
}

await main()
