import assert from 'node:assert/strict'
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { execFileAsync, scriptsDirectory, assertScriptSyntax } from './helpers.mjs'

test('agent synchronizer has valid syntax', () => assertScriptSyntax('sync-agents.mjs'))

const AGENTS = [
  'builder-agent',
  'spec-reviewer-agent',
  'implementation-reviewer-agent',
  'visual-reviewer-agent',
  'custom-agent',
]

async function generateAgents() {
  const root = await mkdtemp(path.join(tmpdir(), 'stardust-sync-agents-'))
  await mkdir(path.join(root, 'scripts'), { recursive: true })
  await mkdir(path.join(root, 'documentation/agents'), { recursive: true })
  await cp(
    path.join(scriptsDirectory, 'sync-agents.mjs'),
    path.join(root, 'scripts/sync-agents.mjs'),
  )
  for (const name of AGENTS)
    await writeFile(
      path.join(root, `documentation/agents/${name}.md`),
      `---\nname: ${name}\ndescription: ${name} fixture\n---\n\n# ${name}\n\nBody.\n`,
    )
  await execFileAsync(process.execPath, [path.join(root, 'scripts/sync-agents.mjs')], {
    cwd: root,
  })
  return root
}

const read = (root, file) => readFile(path.join(root, file), 'utf8')

test('generates per-agent tool restrictions for Claude Code, OpenCode and Codex', async () => {
  const root = await generateAgents()
  try {
    for (const name of ['spec-reviewer-agent', 'implementation-reviewer-agent']) {
      const claude = await read(root, `.claude/agents/${name}.md`)
      assert.match(claude, /^tools: Read, Glob, Grep$/m)
      assert.match(claude, /^permissionMode: plan$/m)
      assert.doesNotMatch(claude, /disallowedTools/)
      assert.match(
        await read(root, `.opencode/agents/${name}.md`),
        /permission:\n {2}edit: deny\n {2}bash: deny\n {2}task: deny/,
      )
      assert.match(
        await read(root, `.codex/agents/${name}.toml`),
        /sandbox_mode = "read-only"/,
      )
    }

    const visual = await read(root, '.claude/agents/visual-reviewer-agent.md')
    assert.match(visual, /^disallowedTools: Edit, Write, NotebookEdit, Bash, Agent$/m)
    assert.doesNotMatch(visual, /^tools:/m)
    assert.match(
      await read(root, '.opencode/agents/visual-reviewer-agent.md'),
      /permission:\n {2}edit: deny\n {2}bash: deny\n {2}task: deny/,
    )
    assert.match(
      await read(root, '.codex/agents/visual-reviewer-agent.toml'),
      /sandbox_mode = "read-only"/,
    )

    const builder = await read(root, '.claude/agents/builder-agent.md')
    assert.match(builder, /^disallowedTools: Agent$/m)
    assert.match(
      await read(root, '.opencode/agents/builder-agent.md'),
      /permission:\n {2}edit: allow\n {2}bash: allow\n {2}task: deny/,
    )
    assert.match(
      await read(root, '.codex/agents/builder-agent.toml'),
      /sandbox_mode = "workspace-write"/,
    )

    const custom = await read(root, '.claude/agents/custom-agent.md')
    assert.doesNotMatch(custom, /^(tools|disallowedTools):/m)
    assert.match(
      await read(root, '.opencode/agents/custom-agent.md'),
      /edit: allow\n {2}bash: allow\n {2}task: allow/,
    )
  } finally {
    await rm(root, { recursive: true, force: true })
  }
})
