import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdir, mkdtemp, rm, unlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import test from 'node:test'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const SCRIPT_PATH = fileURLToPath(new URL('../check-test-integrity.mjs', import.meta.url))
const SOURCE_PATH = 'apps/server/src/rest/controllers/ValueController.ts'
const TEST_PATH = 'apps/server/src/rest/controllers/tests/ValueController.test.ts'

async function runGit(argumentsList, cwd) {
  await execFileAsync('git', argumentsList, { cwd })
}

async function createRepositoryFixture() {
  const repositoryRoot = await mkdtemp(path.join(tmpdir(), 'stardust-test-integrity-'))
  await runGit(['init', '--initial-branch=main'], repositoryRoot)
  await runGit(['config', 'user.email', 'test@example.com'], repositoryRoot)
  await runGit(['config', 'user.name', 'Test Integrity'], repositoryRoot)
  await mkdir(path.dirname(path.join(repositoryRoot, SOURCE_PATH)), { recursive: true })
  await mkdir(path.dirname(path.join(repositoryRoot, TEST_PATH)), { recursive: true })
  await writeFile(path.join(repositoryRoot, 'package.json'), '{}\n')
  await writeFile(path.join(repositoryRoot, SOURCE_PATH), 'export const value = 1\n')
  await writeFile(
    path.join(repositoryRoot, TEST_PATH),
    "import { value } from './value'\ntest('value', () => expect(value).toBe(1))\n",
  )
  await runGit(['add', '.'], repositoryRoot)
  await runGit(['commit', '-m', 'test: create baseline'], repositoryRoot)
  return repositoryRoot
}

test('passes when changed source keeps its test contract', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await writeFile(path.join(repositoryRoot, SOURCE_PATH), 'export const value = 2\n')
    await writeFile(
      path.join(repositoryRoot, TEST_PATH),
      "import { value } from './value'\ntest('value', () => expect(value).toBe(2))\n",
    )
    const { stdout } = await execFileAsync(process.execPath, [SCRIPT_PATH, '--json'], {
      cwd: repositoryRoot,
    })
    const result = JSON.parse(stdout)
    assert.equal(result.status, 'passed')
    assert.deepEqual(result.errors, [])
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('allows removing an obsolete test but still requires coverage for changed source', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await writeFile(path.join(repositoryRoot, SOURCE_PATH), 'export const value = 2\n')
    await unlink(path.join(repositoryRoot, TEST_PATH))
    await assert.rejects(
      execFileAsync(process.execPath, [SCRIPT_PATH, '--json'], { cwd: repositoryRoot }),
      (error) => {
        const result = JSON.parse(error.stdout)
        assert.equal(result.status, 'failed')
        assert.doesNotMatch(result.errors.join('\n'), /test file was removed/)
        assert.match(result.warnings.join('\n'), /no changed test found/)
        return true
      },
    )
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('does not require corresponding tests for excluded source files', async () => {
  const repositoryRoot = await createRepositoryFixture()
  const excludedSourcePaths = [
    'apps/server/src/index.ts',
    'apps/server/src/types/Value.ts',
    'apps/server/src/fixtures/ValueFixture.ts',
    'apps/server/src/mocks/ValueMock.ts',
    'apps/server/src/generated/Value.ts',
    'apps/server/src/entities/fakers/ValueFaker.ts',
  ]
  try {
    await Promise.all(
      excludedSourcePaths.map(async (excludedSourcePath) => {
        await mkdir(path.dirname(path.join(repositoryRoot, excludedSourcePath)), {
          recursive: true,
        })
        await writeFile(
          path.join(repositoryRoot, excludedSourcePath),
          'export const value = 2\n',
        )
      }),
    )
    const { stdout } = await execFileAsync(process.execPath, [SCRIPT_PATH, '--json'], {
      cwd: repositoryRoot,
    })
    const result = JSON.parse(stdout)
    assert.equal(result.status, 'passed')
    assert.deepEqual(result.warnings, [])
    assert.deepEqual(result.testableSourcePaths, [])
    assert.deepEqual(result.excludedSourcePaths, [...excludedSourcePaths].sort())
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('fails when a test is outside the allowed workspace locations', async () => {
  const repositoryRoot = await createRepositoryFixture()
  const forbiddenTestPaths = ['apps/server/src/config/tests/value.test.ts']
  try {
    await Promise.all(
      forbiddenTestPaths.map(async (forbiddenTestPath) => {
        await mkdir(path.dirname(path.join(repositoryRoot, forbiddenTestPath)), {
          recursive: true,
        })
        await writeFile(
          path.join(repositoryRoot, forbiddenTestPath),
          "test('value', () => expect(true).toBe(true))\n",
        )
      }),
    )
    await assert.rejects(
      execFileAsync(process.execPath, [SCRIPT_PATH, '--json'], {
        cwd: repositoryRoot,
      }),
      (error) => {
        const result = JSON.parse(error.stdout)
        assert.equal(result.status, 'failed')
        assert.deepEqual(result.forbiddenTestPaths, [...forbiddenTestPaths].sort())
        assert.match(result.errors.join('\n'), /outside allowed test locations/)
        return true
      },
    )
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('allows RPC action and AI tool test locations', async () => {
  const repositoryRoot = await createRepositoryFixture()
  const allowedSourcePaths = [
    'apps/web/src/rpc/actions/ValueAction.ts',
    'apps/server/src/ai/lesson/tools/ValueTool.ts',
  ]
  const allowedTestPaths = [
    'apps/web/src/rpc/actions/tests/value.test.ts',
    'apps/server/src/ai/lesson/tools/tests/value.test.ts',
  ]
  try {
    await Promise.all(
      allowedSourcePaths.map(async (allowedSourcePath) => {
        await mkdir(path.dirname(path.join(repositoryRoot, allowedSourcePath)), {
          recursive: true,
        })
        await writeFile(
          path.join(repositoryRoot, allowedSourcePath),
          'export const value = 2\n',
        )
      }),
    )
    await Promise.all(
      allowedTestPaths.map(async (allowedTestPath) => {
        await mkdir(path.dirname(path.join(repositoryRoot, allowedTestPath)), {
          recursive: true,
        })
        await writeFile(
          path.join(repositoryRoot, allowedTestPath),
          "test('value', () => expect(true).toBe(true))\n",
        )
      }),
    )
    const { stdout } = await execFileAsync(process.execPath, [SCRIPT_PATH, '--json'], {
      cwd: repositoryRoot,
    })
    const result = JSON.parse(stdout)
    assert.equal(result.status, 'passed')
    assert.deepEqual(result.forbiddenTestPaths, [])
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})
