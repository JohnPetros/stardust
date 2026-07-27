import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { ScopeCheckCommand } from './ScopeCheckCommand'

function git(rootDir: string, args: string[]): string {
  return execFileSync('git', args, {
    cwd: rootDir,
    encoding: 'utf8',
  }).trim()
}

function createRepository(): { rootDir: string; base: string } {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'scope-check-'))
  git(rootDir, ['init', '-q'])
  git(rootDir, ['config', 'user.email', 'tests@example.test'])
  git(rootDir, ['config', 'user.name', 'Tests'])
  fs.mkdirSync(path.join(rootDir, 'allowed'), { recursive: true })
  fs.writeFileSync(path.join(rootDir, 'allowed/tracked.ts'), 'before\n')
  git(rootDir, ['add', '.'])
  git(rootDir, ['commit', '-qm', 'initial'])
  return { rootDir, base: git(rootDir, ['rev-parse', 'HEAD']) }
}

test('matches directories and simple glob patterns', () => {
  const command = new ScopeCheckCommand()
  assert.equal(command.isAllowedPath('apps/web/a.ts', 'apps/web'), true)
  assert.equal(command.isAllowedPath('apps/web/a.ts', 'apps/*/*.ts'), true)
  assert.equal(command.isAllowedPath('apps/web/page.ts', 'apps/web/**/*.ts'), true)
  assert.equal(
    command.isAllowedPath('apps/web/components/page.ts', 'apps/web/**/*.ts'),
    true,
  )
  assert.equal(command.isAllowedPath('apps/server/a.ts', 'apps/web'), false)
})

test('includes tracked and untracked files and rejects paths outside scope', () => {
  const repository = createRepository()
  fs.writeFileSync(path.join(repository.rootDir, 'allowed/tracked.ts'), 'after\n')
  fs.writeFileSync(path.join(repository.rootDir, 'outside.ts'), 'untracked\n')

  const result = new ScopeCheckCommand().execute({
    ...repository,
    allowedPaths: ['allowed'],
  })

  assert.deepEqual(result.details.changedPaths, ['allowed/tracked.ts', 'outside.ts'])
  assert.equal(result.passed, false)
  assert.equal(result.findings[0].path, 'outside.ts')
})
