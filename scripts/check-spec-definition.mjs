import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'

const REQUIRED_FRONTMATTER = [
  'title',
  'status',
  'revision',
  'source',
  'scope',
  'last_updated_at',
]
const REQUIRED_SECTIONS = [
  'Context and scope',
  'Implementation Contract',
  'Technical Contract',
  'Validation Contract',
  'Documentation alignment and revision history',
]
const VALID_STATUSES = new Set([
  'draft',
  'open',
  'in_progress',
  'completed',
  'superseded',
])
const VALID_CHANGES = new Set(['Create', 'Modify', 'Generate', 'Remove'])

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
    throw new Error('Usage: npm run check:spec-definition -- <spec.md> [--json]')
  return { json, specPath: positional[0] }
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

function pathRows(content) {
  const rows = []
  for (const line of content.split('\n')) {
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim().replace(/^`|`$/g, ''))
    if (cells.length < 2 || cells[0] === 'Path' || cells[0] === '---') continue
    if (VALID_CHANGES.has(cells[1])) rows.push({ path: cells[0], change: cells[1] })
  }
  return rows
}

function requirementDefinitions(content) {
  const rf = new Set()
  const ca = new Map()
  for (const line of content.split('\n')) {
    const cells = line
      .split('|')
      .slice(1, -1)
      .map((cell) => cell.trim())
    if (cells.length < 2) continue
    const caId = cells[0].match(/^CA-\d+$/)?.[0]
    const rfId = cells[1].match(/^RF-\d+$/)?.[0]
    if (rfId) rf.add(rfId)
    if (caId && rfId) ca.set(caId, rfId)
  }
  return { rf, ca }
}

async function checkSpecDefinition(specPath) {
  const content = await readFile(specPath, 'utf8')
  const errors = []
  const frontmatter = parseFrontmatter(content)
  if (!frontmatter) errors.push('missing YAML frontmatter')
  else {
    for (const key of REQUIRED_FRONTMATTER) {
      if (!(key in frontmatter)) errors.push(`frontmatter missing ${key}`)
      else if (!frontmatter[key] && !['source', 'scope'].includes(key))
        errors.push(`frontmatter missing ${key}`)
    }
    if (frontmatter.status && !VALID_STATUSES.has(frontmatter.status))
      errors.push(`invalid status: ${frontmatter.status}`)
    if (frontmatter.revision && !/^\d+$/.test(frontmatter.revision))
      errors.push('revision must be an integer')
    if (
      frontmatter.last_updated_at &&
      !/^\d{4}-\d{2}-\d{2}$/.test(frontmatter.last_updated_at)
    )
      errors.push('last_updated_at must be YYYY-MM-DD')
  }

  const sections = firstLevelSections(content)
  for (const section of REQUIRED_SECTIONS)
    if (!sections.includes(section)) errors.push(`missing top-level section: ${section}`)
  if (!content.includes('| Path | Change |'))
    errors.push('missing canonical affected-path table header')
  if (!content.includes('| CA-') || !content.match(/\|\s*CA-\d+\s*\|\s*RF-\d+\s*\|/))
    errors.push('missing RF/CA acceptance-criteria table')

  const { rf, ca } = requirementDefinitions(content)
  if (rf.size === 0) errors.push('no RF-* definitions found')
  if (ca.size === 0) errors.push('no CA-* definitions found')
  for (const [caId, rfId] of ca)
    if (!rf.has(rfId)) errors.push(`${caId} references undefined ${rfId}`)
  const rows = pathRows(content)
  if (rows.length === 0) errors.push('affected-path table has no valid rows')
  const seenPaths = new Set()
  for (const row of rows) {
    if (path.isAbsolute(row.path) || row.path.includes('..'))
      errors.push(`path must be repository-relative: ${row.path}`)
    if (seenPaths.has(row.path)) errors.push(`duplicate affected path: ${row.path}`)
    seenPaths.add(row.path)
  }
  for (const token of ['TBD', 'TODO', 'FIXME'])
    if (new RegExp(`\\b${token}\\b`, 'i').test(content))
      errors.push(`unresolved placeholder: ${token}`)
  return {
    specPath,
    errors,
    status: errors.length === 0 ? 'passed' : 'failed',
    sections,
    affectedPaths: rows.length,
    requirements: { rf: rf.size, ca: ca.size },
  }
}

function printResult(result, json) {
  if (json) console.log(JSON.stringify(result, null, 2))
  else {
    console.log(`Spec definition: ${result.status.toUpperCase()}`)
    for (const error of result.errors) console.error(`ERROR: ${error}`)
  }
}

async function main() {
  try {
    const args = parseArguments(process.argv.slice(2))
    if (args.help) {
      console.log('Usage: npm run check:spec-definition -- <spec.md> [--json]')
      return
    }
    await access(args.specPath)
    const result = await checkSpecDefinition(args.specPath)
    printResult(result, args.json)
    process.exitCode = result.status === 'passed' ? 0 : 1
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 2
  }
}

await main()
