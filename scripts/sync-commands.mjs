#!/usr/bin/env node

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  readlinkSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative } from 'node:path'

const root = process.cwd()
const promptsDir = join(root, 'documentation/prompts')
const agentsDir = join(root, 'documentation/agents')
const outputDirs = ['.cursor/commands', '.claude/commands', '.opencode/commands'].map(
  (dir) => join(root, dir),
)
const skillsDir = join(root, '.agents/skills')

function sourceFiles(directory, suffix) {
  if (!existsSync(directory)) return []
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(suffix))
    .map((entry) => join(directory, entry.name))
    .sort()
}

const prompts = sourceFiles(promptsDir, '.md')
const agents = sourceFiles(agentsDir, '-agent.md')
if (!prompts.length) throw new Error(`No prompts found in '${promptsDir}/*.md'`)
if (!agents.length)
  throw new Error(`No agent definitions found in '${agentsDir}/*-agent.md'`)
for (const directory of [...outputDirs, skillsDir])
  mkdirSync(directory, { recursive: true })

function sourceFromMarker(content) {
  return content.match(
    /<!-- Auto-generated from (documentation\/(?:prompts|agents)\/[^ ]+?)(?: \(symlink not available\))? -->/,
  )?.[1]
}

function cleanupStale() {
  for (const directory of outputDirs) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const destination = join(directory, entry.name)
      if (!entry.name.endsWith('.md')) continue
      if (entry.isSymbolicLink()) {
        const source = readlinkSync(destination)
        if (
          source.startsWith('../../documentation/prompts/') &&
          !existsSync(destination)
        ) {
          rmSync(destination)
          console.log(`removed: ${destination} (missing source)`)
        }
        continue
      }
      const source = sourceFromMarker(readFileSync(destination, 'utf8').slice(0, 2048))
      if (source && !existsSync(join(root, source))) {
        rmSync(destination)
        console.log(`removed: ${destination} (missing source)`)
      }
    }
  }
  for (const skill of readdirSync(skillsDir, { withFileTypes: true })) {
    if (!skill.isDirectory()) continue
    const skillFile = join(skillsDir, skill.name, 'SKILL.md')
    if (!existsSync(skillFile)) continue
    const source = sourceFromMarker(readFileSync(skillFile, 'utf8').slice(0, 2048))
    if (source && !existsSync(join(root, source))) {
      rmSync(skillFile)
      try {
        rmSync(dirname(skillFile))
      } catch {
        /* non-empty directory */
      }
      console.log(`removed: ${dirname(skillFile)} (missing source)`)
    }
  }
}

function descriptionOf(file) {
  const description = readFileSync(file, 'utf8').match(/^description:\s*(.+)$/m)?.[1]
  if (!description) throw new Error(`Missing description in '${relative(root, file)}'`)
  return description
}

function nameOf(file) {
  const name = readFileSync(file, 'utf8').match(/^name:\s*(.+)$/m)?.[1]
  if (!name) throw new Error(`Missing name in '${relative(root, file)}'`)
  return name
}

function linkOrCopy(source, destination) {
  rmSync(destination, { force: true })
  const relativeSource = `../../${relative(root, source).replaceAll('\\', '/')}`
  try {
    symlinkSync(relativeSource, destination)
    console.log(`linked: ${destination} -> ${relativeSource}`)
  } catch {
    writeFileSync(
      destination,
      `<!-- Auto-generated from ${relative(root, source).replaceAll('\\', '/')} (symlink not available) -->\n\n${readFileSync(source, 'utf8')}`,
    )
    console.log(`copied: ${destination} <- ${source}`)
  }
}

function syncSkill(source, name, description) {
  const directory = join(skillsDir, name)
  mkdirSync(directory, { recursive: true })
  const marker = `<!-- Auto-generated from ${relative(root, source).replaceAll('\\', '/')} -->`
  writeFileSync(
    join(directory, 'SKILL.md'),
    `---\nname: ${name}\ndescription: ${description}\n---\n\n${marker}\n\n${readFileSync(source, 'utf8')}`,
  )
  console.log(`synced: ${join(directory, 'SKILL.md')} <- ${source}`)
}

cleanupStale()
for (const source of prompts) {
  const filename = source.split('/').pop()
  const name = filename.replace(/\.md$/, '').replace(/-prompt$/, '')
  const description = descriptionOf(source)
  for (const directory of outputDirs) linkOrCopy(source, join(directory, `${name}.md`))
  syncSkill(source, name, description)
}
for (const source of agents) {
  const expectedName = source.split('/').pop().replace(/\.md$/, '')
  const name = nameOf(source)
  if (name !== expectedName)
    throw new Error(
      `Agent name '${name}' must match filename '${expectedName}' in '${source}'`,
    )
  syncSkill(source, name, descriptionOf(source))
}
