#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs'
import { fileURLToPath } from 'node:url'
import { join, relative } from 'node:path'

const root = fileURLToPath(new URL('..', import.meta.url))
const sourceDir = join(root, 'documentation/agents')
const codexDir = join(root, '.codex')
const codexAgentsDir = join(codexDir, 'agents')
const opencodeDir = join(root, '.opencode/agents')
const claudeDir = join(root, '.claude/agents')
const beginMarkers = [
  '# BEGIN GENERATED AGENTS - scripts/sync-agents.mjs',
  '# BEGIN GENERATED AGENTS - scripts/sync-agents.sh',
]
const endMarkers = [
  '# END GENERATED AGENTS - scripts/sync-agents.mjs',
  '# END GENERATED AGENTS - scripts/sync-agents.sh',
]
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

if (!existsSync(sourceDir))
  throw new Error(`Agent source directory not found: ${sourceDir}`)
for (const directory of [codexAgentsDir, opencodeDir, claudeDir])
  mkdirSync(directory, { recursive: true })

function parseAgent(file) {
  const lines = readFileSync(file, 'utf8').split(/\r?\n/)
  if (lines[0]?.trim() !== '---')
    throw new Error(`Missing YAML frontmatter in ${relative(root, file)}`)
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---')
  if (end < 0) throw new Error(`Unclosed YAML frontmatter in ${relative(root, file)}`)
  const metadata = {}
  for (const line of lines.slice(1, end)) {
    const separator = line.indexOf(':')
    if (separator < 0) continue
    metadata[line.slice(0, separator).trim()] = line
      .slice(separator + 1)
      .trim()
      .replace(/^(["'])(.*)\1$/, '$2')
  }
  const expectedName = file.split('/').pop().replace(/\.md$/, '')
  const { name, description } = metadata
  const body = `${lines
    .slice(end + 1)
    .join('\n')
    .trim()}\n`
  if (!name) throw new Error(`Missing name in ${relative(root, file)}`)
  if (!description) throw new Error(`Missing description in ${relative(root, file)}`)
  if (name !== expectedName)
    throw new Error(
      `Agent name '${name}' must match filename '${expectedName}' in ${relative(root, file)}`,
    )
  if (!namePattern.test(name))
    throw new Error(`Invalid agent name '${name}' in ${relative(root, file)}`)
  if (!body.trim())
    throw new Error(`Missing agent instructions in ${relative(root, file)}`)
  return { name, description, body, source: file }
}

function readOnly(name) {
  return (
    name.startsWith('judge-') ||
    ['searcher-agent', 'spec-reviewer-agent', 'implementation-reviewer-agent'].includes(
      name,
    )
  )
}

function writeIfChanged(file, content, managed = false) {
  if (existsSync(file)) {
    const current = readFileSync(file, 'utf8')
    if (current === content) return console.log(`unchanged: ${relative(root, file)}`)
    if (managed && !current.includes('Auto-generated from documentation/agents/'))
      throw new Error(`Refusing to overwrite unmanaged file: ${relative(root, file)}`)
  }
  writeFileSync(file, content)
  console.log(`synced:    ${relative(root, file)}`)
}

function cleanup(directory, suffix, validNames) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (
      !entry.name.endsWith(suffix) ||
      validNames.has(entry.name.slice(0, -suffix.length))
    )
      continue
    const file = join(directory, entry.name)
    try {
      if (
        readFileSync(file, 'utf8')
          .slice(0, 2048)
          .includes('Auto-generated from documentation/agents/')
      ) {
        unlinkSync(file)
        console.log(`removed:   ${relative(root, file)}`)
      }
    } catch {
      // Ignore unreadable generated artifacts.
    }
  }
}

const agents = readdirSync(sourceDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && entry.name.endsWith('-agent.md'))
  .map((entry) => parseAgent(join(sourceDir, entry.name)))
  .sort((a, b) => a.name.localeCompare(b.name))
if (!agents.length)
  throw new Error('No agent definitions found in documentation/agents/*-agent.md')
const validNames = new Set(agents.map((agent) => agent.name))
cleanup(codexAgentsDir, '.toml', validNames)
cleanup(opencodeDir, '.md', validNames)
cleanup(claudeDir, '.md', validNames)

const roles = [beginMarkers[0]]
for (const agent of agents) {
  const source = relative(root, agent.source).replaceAll('\\', '/')
  const mode = readOnly(agent.name) ? 'read-only' : 'workspace-write'
  writeIfChanged(
    join(codexAgentsDir, `${agent.name}.toml`),
    `# Auto-generated from ${source}\nmodel_instructions_file = ${JSON.stringify(`../../${source}`)}\nsandbox_mode = ${JSON.stringify(mode)}\n`,
    true,
  )
  roles.push(
    '',
    `[agents.${JSON.stringify(agent.name)}]`,
    `description = ${JSON.stringify(agent.description)}`,
    `config_file = ${JSON.stringify(`agents/${agent.name}.toml`)}`,
  )
  const permissions = readOnly(agent.name)
    ? '  edit: deny\n  bash: deny\n  task: deny'
    : agent.name === 'builder-agent'
      ? '  edit: allow\n  bash: allow\n  task: deny'
      : '  edit: allow\n  bash: allow\n  task: allow'
  writeIfChanged(
    join(opencodeDir, `${agent.name}.md`),
    `---\ndescription: ${JSON.stringify(agent.description)}\nmode: subagent\npermission:\n${permissions}\n---\n\n<!-- Auto-generated from ${source} -->\n\n${agent.body}`,
    true,
  )
  const claude = [
    '---',
    `name: ${agent.name}`,
    `description: ${JSON.stringify(agent.description)}`,
  ]
  if (readOnly(agent.name)) claude.push('tools: Read, Glob, Grep', 'permissionMode: plan')
  else if (agent.name === 'builder-agent') claude.push('disallowedTools: Agent')
  claude.push(
    '---',
    '',
    `<!-- Auto-generated from ${source} -->`,
    '',
    agent.body.trim(),
    '',
  )
  writeIfChanged(join(claudeDir, `${agent.name}.md`), claude.join('\n'), true)
}

roles.push('', endMarkers[0])
const managedBlock = `${roles.join('\n')}\n`
const configFile = join(codexDir, 'config.toml')
let config = existsSync(configFile) ? readFileSync(configFile, 'utf8') : ''
const markerPairs = beginMarkers.map((begin, index) => ({
  begin,
  end: endMarkers[index],
}))
for (const { begin, end } of markerPairs) {
  if ((config.includes(begin) ? 1 : 0) !== (config.includes(end) ? 1 : 0))
    throw new Error(`Unbalanced generated-agent markers in ${relative(root, configFile)}`)
}
for (const { begin, end } of markerPairs) {
  if (!config.includes(begin)) continue
  const beginIndex = config.indexOf(begin)
  const endIndex = config.indexOf(end, beginIndex + begin.length)
  if (endIndex < 0)
    throw new Error(`Unbalanced generated-agent markers in ${relative(root, configFile)}`)
  config = `${config.slice(0, beginIndex).trimEnd()}${config.slice(endIndex + end.length).replace(/^\n*/, '')}`
}
writeIfChanged(
  configFile,
  `${config.trimEnd()}${config.trimEnd() ? '\n\n' : ''}${managedBlock}`,
)
console.log('Configured agents for Codex, OpenCode and Claude Code.')
