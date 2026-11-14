import { execFile } from 'node:child_process'
import { lstat, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { promisify } from 'node:util'

const DEFAULT_BASE = 'main'
const ALLOWED_CHANGES = new Set(['Create', 'Generate', 'Modify', 'Remove'])
const PLAN_STATUSES = new Set(['pending', 'in_progress', 'completed'])
const PLAN_DOCUMENT_STATUSES = new Set(['in_progress', 'completed'])
const REQUIREMENT_ID_PATTERN = /\b(?:RF|CA)-\d+[A-Za-z]*\b/g
const USAGE =
  'Usage: pnpm run check:spec-implementation <documentation/features/.../spec.md|*-spec.md> [--base <git-ref>] [--plan-only] [--require-plan] [--json]'
const execFileAsync = promisify(execFile)

function parseArguments(argumentsList) {
  const positionalArguments = []
  let base = DEFAULT_BASE
  let shouldPrintJson = false
  let planOnly = false
  let requirePlan = false

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index]

    if (argument === '--') continue
    if (argument === '--help') return { shouldPrintHelp: true }
    if (argument === '--plan-only') {
      planOnly = true
      continue
    }
    if (argument === '--require-plan') {
      requirePlan = true
      continue
    }
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
    throw new Error(USAGE)
  }

  return {
    base,
    planOnly,
    requirePlan,
    shouldPrintHelp: false,
    shouldPrintJson,
    specArgument: positionalArguments[0],
  }
}

function printHelp() {
  console.log(USAGE)
  console.log(
    'Checks every Create, Modify, Generate and Remove path in the Spec against Git and disk.',
  )
  console.log(
    'A sibling plan.md (spec.md -> plan.md, <name>-spec.md -> <name>-plan.md) is validated against the Spec when it exists.',
  )
  console.log(
    '--plan-only validates only the plan against the Spec, without requiring delivered paths.',
  )
  console.log(
    '--require-plan requires the plan to exist and every row to be completed; the sibling evaluation.md may opt out with "plan: none" and must otherwise declare "plan:".',
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

function unquote(value) {
  return (value ?? '').replace(/^(["'])(.*)\1$/, '$2')
}

function parseFrontmatter(markdown) {
  const block = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
  const fields = {}
  for (const line of block.split(/\r?\n/)) {
    // Only top-level keys count: nested entries (for example `source[].revision`)
    // must not overwrite the Spec's own `revision`.
    if (/^[\s-]/.test(line)) continue
    const separator = line.indexOf(':')
    if (separator > 0)
      fields[line.slice(0, separator).trim()] = unquote(line.slice(separator + 1).trim())
  }
  return fields
}

function planPathFor(relativeSpecPath) {
  return relativeSpecPath.replace(/spec\.md$/, 'plan.md')
}

function evaluationPathFor(relativeSpecPath) {
  return relativeSpecPath.replace(/spec\.md$/, 'evaluation.md')
}

/**
 * The Evaluation declares how its delivery tracks progress: `plan: <path>` requires
 * the plan, `plan: none` is the explicit opt-out of a delivery that predates plan.md,
 * and a missing key is an error so no delivery is left without a plan by omission.
 */
async function resolvePlanRequirement({
  errors,
  planOnly,
  relativeEvaluationPath,
  repositoryRoot,
  requirePlan,
}) {
  if (!requirePlan || planOnly) return { optOut: false, requirePlan }
  let markdown
  try {
    markdown = await readFile(path.join(repositoryRoot, relativeEvaluationPath), 'utf8')
  } catch (error) {
    if (error?.code === 'ENOENT') return { optOut: false, requirePlan }
    throw error
  }
  const declaration = parseFrontmatter(markdown).plan
  if (declaration === 'none') return { optOut: true, requirePlan: false }
  if (!declaration)
    errors.push(
      `${relativeEvaluationPath}: frontmatter must declare plan: <path> or plan: none (explicit opt-out for a delivery that predates plan.md)`,
    )
  return { optOut: false, requirePlan }
}

function splitCells(line) {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim())
}

/**
 * Plan rows share the first two cells with the Spec path map; the remaining
 * cells are fixed by position: RF/CA, Status, Notes.
 */
function parsePlanRows(markdown) {
  const rows = []
  const malformed = []
  for (const line of markdown.split(/\r?\n/)) {
    if (!line.trim().startsWith('|')) continue
    const cells = splitCells(line)
    const pathMatch = cells[0]?.match(/^`([^`]+)`$/)
    if (!pathMatch || !ALLOWED_CHANGES.has(cells[1])) continue
    if (cells.length < 4) {
      malformed.push(pathMatch[1])
      continue
    }
    rows.push({
      change: cells[1],
      path: pathMatch[1],
      requirements: cells[2],
      status: cells[3].replaceAll('`', ''),
    })
  }
  return { malformed, rows }
}

async function checkPlan({
  affectedPaths,
  basePaths,
  changedPaths,
  currentTrackedPaths,
  errors,
  planOnly,
  relativePlanPath,
  repositoryRoot,
  requirePlan,
  specMarkdown,
  untrackedPaths,
}) {
  let markdown
  try {
    markdown = await readFile(path.join(repositoryRoot, relativePlanPath), 'utf8')
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error
    if (planOnly || requirePlan)
      errors.push(`${relativePlanPath}: plan is required but does not exist`)
    return undefined
  }

  const planErrors = []
  const fields = parseFrontmatter(markdown)
  const specRevision = parseFrontmatter(specMarkdown).revision
  const planStatus = fields.status
  if (!PLAN_DOCUMENT_STATUSES.has(planStatus))
    planErrors.push(
      `status must be in_progress or completed (found "${planStatus ?? ''}")`,
    )
  if (specRevision && fields.spec_revision !== specRevision)
    planErrors.push(
      `spec_revision "${fields.spec_revision ?? ''}" does not match the Spec revision "${specRevision}"`,
    )

  const { malformed, rows } = parsePlanRows(markdown)
  for (const malformedPath of malformed)
    planErrors.push(
      `${malformedPath}: row must have Path, Change, RF/CA and Status cells`,
    )
  if (rows.length === 0 && malformed.length === 0)
    planErrors.push('plan has no rows using Create, Modify, Generate or Remove')

  const specIds = new Set(specMarkdown.match(REQUIREMENT_ID_PATTERN) ?? [])
  const specChanges = new Map(
    affectedPaths.map(({ change, path: contractedPath }) => [contractedPath, change]),
  )
  const seenPaths = new Set()
  for (const row of rows) {
    if (seenPaths.has(row.path)) {
      planErrors.push(`${row.path}: appears more than once`)
      continue
    }
    seenPaths.add(row.path)
    const specChange = specChanges.get(row.path)
    if (!specChange) planErrors.push(`${row.path}: row is not in the Spec path map`)
    else if (specChange !== row.change)
      planErrors.push(
        `${row.path}: Change ${row.change} differs from the Spec (${specChange})`,
      )
    if (!PLAN_STATUSES.has(row.status))
      planErrors.push(
        `${row.path}: status must be pending, in_progress or completed (found "${row.status}")`,
      )
    const linkedIds = row.requirements.match(REQUIREMENT_ID_PATTERN) ?? []
    if (linkedIds.length === 0)
      planErrors.push(`${row.path}: RF/CA must link at least one RF-* or CA-*`)
    for (const id of linkedIds)
      if (!specIds.has(id))
        planErrors.push(`${row.path}: ${id} does not exist in the Spec`)
  }
  for (const contractedPath of specChanges.keys())
    if (!seenPaths.has(contractedPath))
      planErrors.push(`${contractedPath}: Spec path has no plan row`)

  if (!planOnly) {
    for (const row of rows) {
      if (row.status !== 'completed' || !specChanges.has(row.path)) continue
      if (validateAffectedPath(row.path)) continue
      const rowErrors = []
      addClassificationFindings({
        affectedPath: { change: row.change, path: row.path },
        basePaths,
        changedPaths,
        currentPath: await inspectCurrentPath(repositoryRoot, row.path),
        currentTrackedPaths,
        errors: rowErrors,
        untrackedPaths,
      })
      for (const rowError of rowErrors)
        planErrors.push(`${rowError} (row is marked completed)`)
    }
  }

  if (requirePlan || planStatus === 'completed')
    for (const row of rows)
      if (row.status !== 'completed')
        planErrors.push(
          `${row.path}: status is ${row.status} but every row must be completed`,
        )

  for (const planError of planErrors) errors.push(`${relativePlanPath}: ${planError}`)
  const statusCounts = Object.fromEntries(
    [...PLAN_STATUSES].map((status) => [
      status,
      rows.filter((row) => row.status === status).length,
    ]),
  )
  return { path: relativePlanPath, rowsCount: rows.length, statusCounts }
}

async function checkSpecImplementation({ base, planOnly, requirePlan, specArgument }) {
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

  // --plan-only validates the plan against the Spec and needs no Git state.
  const baseSha = planOnly
    ? null
    : (
        await runGit(
          ['rev-parse', '--verify', '--end-of-options', `${base}^{commit}`],
          repositoryRoot,
        )
      )
        .toString('utf8')
        .trim()
  const emptyOutput = Buffer.alloc(0)
  const [markdown, baseOutput, diffOutput, trackedOutput, untrackedOutput] =
    await Promise.all([
      readFile(specPath, 'utf8'),
      planOnly
        ? emptyOutput
        : runGit(['ls-tree', '-r', '-z', '--name-only', baseSha], repositoryRoot),
      planOnly
        ? emptyOutput
        : runGit(
            ['diff', '--name-status', '-z', '--no-renames', baseSha, '--'],
            repositoryRoot,
          ),
      planOnly ? emptyOutput : runGit(['ls-files', '-z', '--cached'], repositoryRoot),
      planOnly
        ? emptyOutput
        : runGit(['ls-files', '--others', '--exclude-standard', '-z'], repositoryRoot),
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
    if (planOnly) continue
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

  const planRequirement = await resolvePlanRequirement({
    errors,
    planOnly,
    relativeEvaluationPath: evaluationPathFor(relativeSpecPath),
    repositoryRoot,
    requirePlan,
  })
  const plan = await checkPlan({
    affectedPaths,
    basePaths,
    changedPaths,
    currentTrackedPaths,
    errors,
    planOnly,
    relativePlanPath: planPathFor(relativeSpecPath),
    repositoryRoot,
    requirePlan: planRequirement.requirePlan,
    specMarkdown: markdown,
    untrackedPaths,
  })

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
    plan: plan ?? null,
    planOnly,
    planOptOut: planRequirement.optOut,
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
  if (result.baseSha) console.log(`Baseline: ${result.base} (${result.baseSha})`)
  console.log(
    `Contracted paths: ${result.pathsCount} (Create ${result.counts.Create}, Modify ${result.counts.Modify}, Generate ${result.counts.Generate}, Remove ${result.counts.Remove})`,
  )
  if (result.plan)
    console.log(
      `Plan: ${result.plan.path} (${result.plan.rowsCount} rows: pending ${result.plan.statusCounts.pending}, in_progress ${result.plan.statusCounts.in_progress}, completed ${result.plan.statusCounts.completed})`,
    )
  else if (result.planOptOut)
    console.log('Plan: opted out (evaluation.md declares plan: none)')
  else console.log('Plan: not present')
  if (result.planOnly)
    console.log('Mode: plan-only (delivery of the contracted paths was not checked).')
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
