import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdtemp, mkdir, rm, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const SCRIPT_PATH = fileURLToPath(
  new URL('../check-spec-implementation.mjs', import.meta.url),
)
const SPEC_PATH = 'documentation/features/example/path-check/spec.md'
const SPEC = `---
title: Path check
status: in_progress
revision: 1
---

# 1. Context and scope

# 2. Implementation Contract

# 3. Technical Contract

| Path | Change | Declaration | Contract |
| --- | --- | --- | --- |
| \`src/created.ts\` | Create | created | new |
| \`src/modified.ts\` | Modify | modified | changed |
| \`src/generated.ts\` | Generate | generated | generated |
| \`src/removed.ts\` | Remove | removed | deleted |

# 4. Validation Contract

# 5. Documentation alignment and revision history
`

async function runGit(argumentsList, cwd) {
  await execFileAsync('git', argumentsList, { cwd })
}

async function createRepositoryFixture() {
  const repositoryRoot = await mkdtemp(path.join(tmpdir(), 'stardust-spec-check-'))
  await runGit(['init', '--initial-branch=main'], repositoryRoot)
  await runGit(['config', 'user.email', 'test@example.com'], repositoryRoot)
  await runGit(['config', 'user.name', 'Spec Check Test'], repositoryRoot)
  await mkdir(path.join(repositoryRoot, path.dirname(SPEC_PATH)), { recursive: true })
  await mkdir(path.join(repositoryRoot, 'src'), { recursive: true })
  await writeFile(path.join(repositoryRoot, SPEC_PATH), SPEC)
  await writeFile(
    path.join(repositoryRoot, 'src/modified.ts'),
    'export const value = 1\n',
  )
  await writeFile(path.join(repositoryRoot, 'src/generated.ts'), 'generated: 1\n')
  await writeFile(path.join(repositoryRoot, 'src/removed.ts'), 'remove me\n')
  await runGit(['add', '.'], repositoryRoot)
  await runGit(['commit', '-m', 'test: create baseline'], repositoryRoot)
  return repositoryRoot
}

test('passes when every contracted path has the expected Git state', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await writeFile(
      path.join(repositoryRoot, 'src/created.ts'),
      'export const created = true\n',
    )
    await writeFile(
      path.join(repositoryRoot, 'src/modified.ts'),
      'export const value = 2\n',
    )
    await writeFile(path.join(repositoryRoot, 'src/generated.ts'), 'generated: 2\n')
    await unlink(path.join(repositoryRoot, 'src/removed.ts'))
    const { stdout } = await execFileAsync(
      process.execPath,
      [SCRIPT_PATH, SPEC_PATH, '--json'],
      { cwd: repositoryRoot },
    )
    const result = JSON.parse(stdout)
    assert.equal(result.status, 'passed')
    assert.equal(result.pathsCount, 4)
    assert.deepEqual(result.errors, [])
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('reports missing or unchanged contracted paths', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await assert.rejects(
      execFileAsync(process.execPath, [SCRIPT_PATH, SPEC_PATH, '--json'], {
        cwd: repositoryRoot,
      }),
      (error) => {
        const output = JSON.parse(error.stdout)
        const messages = output.errors.join('\n')
        assert.equal(output.status, 'failed')
        assert.match(messages, /src\/created\.ts: Create path is missing/)
        assert.match(messages, /src\/modified\.ts: Modify path is unchanged/)
        assert.match(messages, /src\/generated\.ts: Generate path is unchanged/)
        assert.match(messages, /src\/removed\.ts: Remove path still exists/)
        return true
      },
    )
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})
