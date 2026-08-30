#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { output } from './utils.mjs'

const root = output('git', ['rev-parse', '--show-toplevel'])
const sourceConfig = process.env.SOURCE_CONFIG ?? join(root, '.codex/config.toml')
const opencodeOutput = process.env.OPENCODE_OUTPUT ?? join(root, 'opencode.json')
const codexOutput =
  process.env.CODEX_OUTPUT ?? join(process.env.HOME ?? '', '.codex/config.toml')
if (!existsSync(sourceConfig)) throw new Error(`Source config not found: ${sourceConfig}`)

function stripComment(value) {
  let quote = null
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]
    if (char === quote && value[index - 1] !== '\\') quote = null
    else if ((char === '"' || char === "'") && !quote) quote = char
    else if (char === '#' && !quote) return value.slice(0, index).trim()
  }
  return value.trim()
}

function splitTopLevel(value, separator = ',') {
  const parts = []
  let start = 0
  let depth = 0
  let quote = null
  for (let index = 0; index < value.length; index += 1) {
    const char = value[index]
    if (char === quote && value[index - 1] !== '\\') quote = null
    else if ((char === '"' || char === "'") && !quote) quote = char
    else if (!quote && char === '[') depth += 1
    else if (!quote && char === ']') depth -= 1
    else if (!quote && depth === 0 && char === separator) {
      parts.push(value.slice(start, index).trim())
      start = index + 1
    }
  }
  parts.push(value.slice(start).trim())
  return parts.filter(Boolean)
}

function parseValue(value) {
  if (value.startsWith('[') && value.endsWith(']'))
    return splitTopLevel(value.slice(1, -1)).map(parseValue)
  if (value.startsWith('"')) return JSON.parse(value)
  if (value.startsWith("'")) return value.slice(1, -1).replaceAll("''", "'")
  if (value === 'true' || value === 'false') return value === 'true'
  if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value)
  return value
}

function parsePath(value) {
  return splitTopLevel(value.replaceAll('"', ''), '.')
}

function parseToml(content) {
  const result = {}
  let current = result
  for (const line of content.split(/\r?\n/)) {
    const clean = stripComment(line).trim()
    if (!clean) continue
    const section = clean.match(/^\[([^\]]+)\]$/)
    if (section) {
      current = result
      for (const part of parsePath(section[1])) current = current[part] ??= {}
      continue
    }
    const separator = clean.indexOf('=')
    if (separator < 0) continue
    current[clean.slice(0, separator).trim().replaceAll('"', '')] = parseValue(
      clean.slice(separator + 1).trim(),
    )
  }
  return result
}

const config = parseToml(readFileSync(sourceConfig, 'utf8'))
const servers = config.mcp_servers
if (
  !servers ||
  typeof servers !== 'object' ||
  Array.isArray(servers) ||
  !Object.keys(servers).length
)
  throw new Error('Expected a non-empty [mcp_servers] table in the source config.')

const mcp = {}
for (const [name, server] of Object.entries(servers)) {
  if (!server || typeof server !== 'object' || Array.isArray(server))
    throw new Error(`Server '${name}' must be a table.`)
  if (server.url) {
    mcp[name] = { type: 'remote', url: server.url, enabled: true }
    if (server.http_headers) mcp[name].headers = server.http_headers
  } else if (server.command) {
    mcp[name] = {
      type: 'local',
      command: [server.command, ...(server.args ?? [])],
      enabled: true,
    }
    if (server.startup_timeout_ms !== undefined)
      mcp[name].timeout = server.startup_timeout_ms
  } else throw new Error(`Server '${name}' must define either 'url' or 'command'.`)
}

mkdirSync(dirname(opencodeOutput), { recursive: true })
mkdirSync(dirname(codexOutput), { recursive: true })
writeFileSync(
  opencodeOutput,
  `${JSON.stringify({ $schema: 'https://opencode.ai/config.json', mcp }, null, 2)}\n`,
)

function removeMcpBlocks(content) {
  const kept = []
  let skipping = false
  for (const line of content.split(/\r?\n/)) {
    if (/^\[\[?mcp_servers(?:\.|\])/.test(line)) {
      skipping = true
      continue
    }
    if (skipping && /^\[/.test(line)) skipping = false
    if (!skipping) kept.push(line)
  }
  return kept.join('\n').replace(/\n*$/, '')
}

const existing = existsSync(codexOutput)
  ? removeMcpBlocks(readFileSync(codexOutput, 'utf8'))
  : ''
writeFileSync(
  codexOutput,
  `${existing ? `${existing}\n\n` : ''}${readFileSync(sourceConfig, 'utf8').replace(/\s*$/, '')}\n`,
)
console.log(`Wrote ${opencodeOutput}`)
console.log(`Synced ${codexOutput}`)
