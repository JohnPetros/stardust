import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const REQUIRED_FRONTMATTER = [
  'title',
  'status',
  'spec',
  'spec_revision',
  'evaluation',
  'updated_at',
]
const REQUIRED_SECTIONS = [
  'Execution status',
  'Execution ledger',
  'Validation and handoff',
  'Execution log',
]
const VALID_STATUSES = new Set(['pending', 'in_progress', 'completed', 'superseded'])
const VALID_TASK_STATUSES = new Set([
  'pending',
  'in_progress',
  'completed',
  'verified',
  'blocked',
])
const COMPLETE_TASK_STATUSES = new Set(['completed', 'verified'])

function parseArguments(argumentsList) {
  const positional = []
  let json = false
  for (const argument of argumentsList) {
    if (argument === '--') continue
    if (argument === '--json') json = true
    else if (argument === '--help') return { help: true }
    else if (argument.startsWith('--')) throw new Error(`Unknown option: ${argument}`)
    else positional.push(argument)
  }
  if (positional.length !== 1)
    throw new Error('Usage: npm run check:plan-definition -- <plan.md> [--json]')
  return { json, planPath: positional[0] }
}

function parseFrontmatter(content) {
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)/)
  if (!match) return null
  const values = {}
  for (const line of match[1].split('\n')) {
    const entry = line.match(/^([A-Za-z_][\w-]*):\s*(.*)$/)
    if (entry) values[entry[1]] = entry[2].trim()
  }
  return values
}

function firstLevelSections(content) {
  return [...content.matchAll(/^#\s+(.+)$/gm)].map((match) => match[1].trim())
}

function ledgerRows(content) {
  const rows = []
  for (const line of content.split('\n')) {
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim())
    if (
      cells.length !== 8 ||
      cells[0] === 'Wave' ||
      cells.every((cell) => /^-+$/.test(cell))
    )
      continue
    rows.push({
      wave: cells[0],
      builder: cells[1],
      phase: cells[2],
      name: cells[3],
      dependsOn: cells[4],
      parallelWith: cells[5],
      status: cells[6],
      exit: cells[7],
    })
  }
  return rows
}

function dependencyNames(value) {
  return value
    .split(/[,;]+/)
    .map((item) => item.trim())
    .filter((item) => item && !/^(?:—|-|none|n\/a)$/i.test(item))
}

function hasPairedReviewer(content, builder) {
  const escapedBuilder = builder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(
    `(?:implementation-reviewer-agent[\\s\\S]{0,160}${escapedBuilder}|${escapedBuilder}[\\s\\S]{0,160}implementation-reviewer-agent)`,
    'i',
  )
  return pattern.test(content)
}

async function checkPlanDefinition(planPath) {
  const content = await readFile(planPath, 'utf8')
  const errors = []
  const frontmatter = parseFrontmatter(content)
  if (!frontmatter) errors.push('missing YAML frontmatter')
  else {
    for (const key of REQUIRED_FRONTMATTER)
      if (!frontmatter[key]) errors.push(`frontmatter missing ${key}`)
    if (frontmatter.status && !VALID_STATUSES.has(frontmatter.status))
      errors.push(`invalid status: ${frontmatter.status}`)
    if (frontmatter.spec_revision && !/^\d+$/.test(frontmatter.spec_revision))
      errors.push('spec_revision must be an integer')
    if (frontmatter.updated_at && !/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.updated_at))
      errors.push('updated_at must be YYYY-MM-DD')
    if (frontmatter.spec && path.isAbsolute(frontmatter.spec))
      errors.push('spec must be a relative path')
    if (frontmatter.evaluation && path.isAbsolute(frontmatter.evaluation))
      errors.push('evaluation must be a relative path')
  }

  const sections = firstLevelSections(content)
  for (const section of REQUIRED_SECTIONS)
    if (!sections.includes(section)) errors.push(`missing top-level section: ${section}`)
  if (!content.match(/\|\s*Wave\s*\|\s*Builder\s*\|\s*Phase\s*\|\s*Name\s*\|/))
    errors.push('missing canonical execution-ledger header')
  if (!content.match(/\|\s*Type\s*\|\s*Scenario\/surface\s*\|/))
    errors.push('missing validation table header')

  const rows = ledgerRows(content)
  if (rows.length === 0) errors.push('execution ledger has no rows')
  const names = new Set()
  for (const row of rows) {
    if (!row.wave || !row.builder || !row.phase || !row.name || !row.exit)
      errors.push(`incomplete ledger row: ${row.name || '<unnamed>'}`)
    if (!VALID_TASK_STATUSES.has(row.status))
      errors.push(`${row.name || '<unnamed>'}: invalid status ${row.status}`)
    if (names.has(row.name)) errors.push(`duplicate ledger task: ${row.name}`)
    names.add(row.name)
  }
  for (const row of rows) {
    for (const dependency of dependencyNames(row.dependsOn))
      if (!names.has(dependency))
        errors.push(`${row.name}: unknown dependency ${dependency}`)
  }

  const graph = new Map(rows.map((row) => [row.name, dependencyNames(row.dependsOn)]))
  const visiting = new Set()
  const visited = new Set()
  function visit(name) {
    if (visiting.has(name)) return true
    if (visited.has(name)) return false
    visiting.add(name)
    const cycle = (graph.get(name) ?? []).some(visit)
    visiting.delete(name)
    visited.add(name)
    return cycle
  }
  for (const name of graph.keys())
    if (visit(name)) {
      errors.push('execution ledger dependency graph contains a cycle')
      break
    }

  const builders = new Set(rows.map((row) => row.builder))
  const reviewerMentions = (content.match(/implementation-reviewer-agent/g) ?? []).length
  if (builders.size > 0 && reviewerMentions < builders.size)
    errors.push(
      `each Builder needs a paired Implementation Reviewer (${reviewerMentions}/${builders.size} declared)`,
    )
  for (const builder of builders)
    if (!hasPairedReviewer(content, builder))
      errors.push(`${builder}: no paired Implementation Reviewer declaration`)
  if (frontmatter?.spec) {
    const specPath = path.resolve(path.dirname(planPath), frontmatter.spec)
    try {
      const specContent = await readFile(specPath, 'utf8')
      const specRevision = specContent.match(/^revision:\s*(\d+)\s*$/m)?.[1]
      if (
        frontmatter.spec_revision &&
        specRevision &&
        frontmatter.spec_revision !== specRevision
      )
        errors.push(
          `Plan spec_revision ${frontmatter.spec_revision} does not match Spec revision ${specRevision}`,
        )
      const specRequirements = new Set(specContent.match(/\b(?:RF|CA)-\d+\b/g) ?? [])
      for (const requirement of new Set(content.match(/\b(?:RF|CA)-\d+\b/g) ?? []))
        if (!specRequirements.has(requirement))
          errors.push(`Plan references undefined ${requirement} in Spec`)
    } catch {
      errors.push(`Spec file not found: ${frontmatter.spec}`)
    }
  }
  if (frontmatter?.status === 'completed') {
    const incomplete = rows.filter((row) => !COMPLETE_TASK_STATUSES.has(row.status))
    if (incomplete.length > 0)
      errors.push(
        `completed Plan has incomplete tasks: ${incomplete.map((row) => row.name).join(', ')}`,
      )
    if (frontmatter.evaluation) {
      const evaluationPath = path.resolve(path.dirname(planPath), frontmatter.evaluation)
      try {
        const evaluation = parseFrontmatter(await readFile(evaluationPath, 'utf8'))
        if (!evaluation) errors.push('evaluation is missing YAML frontmatter')
        else if (!['ready', 'completed'].includes(evaluation.status))
          errors.push(
            `completed Plan requires Evaluation status ready/completed (found ${evaluation.status || 'missing'})`,
          )
      } catch {
        errors.push(`evaluation file not found: ${frontmatter.evaluation}`)
      }
    } else errors.push('completed Plan must reference evaluation')
  }
  for (const token of ['TBD', 'TODO', 'FIXME'])
    if (new RegExp(`\\b${token}\\b`, 'i').test(content))
      errors.push(`unresolved placeholder: ${token}`)
  return {
    planPath,
    errors,
    status: errors.length === 0 ? 'passed' : 'failed',
    sections,
    tasks: rows.length,
    builders: builders.size,
    reviewerMentions,
  }
}

function printResult(result, json) {
  if (json) console.log(JSON.stringify(result, null, 2))
  else {
    console.log(`Plan definition: ${result.status.toUpperCase()}`)
    for (const error of result.errors) console.error(`ERROR: ${error}`)
  }
}

async function main() {
  try {
    const args = parseArguments(process.argv.slice(2))
    if (args.help) {
      console.log('Usage: npm run check:plan-definition -- <plan.md> [--json]')
      return
    }
    await access(args.planPath)
    const result = await checkPlanDefinition(args.planPath)
    printResult(result, args.json)
    process.exitCode = result.status === 'passed' ? 0 : 1
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 2
  }
}

await main()
