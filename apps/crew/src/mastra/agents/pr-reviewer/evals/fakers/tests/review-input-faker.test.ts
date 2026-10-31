import { spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import { ReviewInputFaker } from '@/mastra/agents/pr-reviewer/evals/fakers/review-input-faker'
import type { EvalCase } from '@/mastra/agents/pr-reviewer/types/eval-case'

const GIT_ENV = {
  ...process.env,
  GIT_AUTHOR_NAME: 'Test',
  GIT_AUTHOR_EMAIL: 'test@example.com',
  GIT_COMMITTER_NAME: 'Test',
  GIT_COMMITTER_EMAIL: 'test@example.com',
}

const LINES = Array.from(
  { length: 20 },
  (_, index) => `export const value${index} = ${index}`,
)

function git(directory: string, ...args: string[]): string {
  const result = spawnSync('git', args, { cwd: directory, env: GIT_ENV })

  if (result.status !== 0) throw new Error(result.stderr.toString())

  return result.stdout.toString().trim()
}

function write(directory: string, path: string, content: string) {
  mkdirSync(dirname(join(directory, path)), { recursive: true })
  writeFileSync(join(directory, path), content)
}

function commit(directory: string, message: string): string {
  git(directory, 'add', '-A')
  git(directory, '-c', 'commit.gpgsign=false', 'commit', '-m', message)

  return git(directory, 'rev-parse', 'HEAD')
}

function buildEvalCase(
  baseSha: string,
  headSha: string,
  excludedPathPrefixes?: string[],
): EvalCase {
  return {
    name: 'rename-case',
    source_pr: 'JohnPetros/stardust#1',
    description: 'Range with a rename and a plain change.',
    base_sha: baseSha,
    head_sha: headSha,
    ...(excludedPathPrefixes ? { excluded_path_prefixes: excludedPathPrefixes } : {}),
    expected: [],
  }
}

describe('ReviewInputFaker', () => {
  let directory: string
  let baseSha: string
  let headSha: string

  beforeAll(() => {
    directory = mkdtempSync(join(tmpdir(), 'crew-faker-test-'))
    git(directory, 'init', '--initial-branch=main')
    write(directory, 'AGENTS.md', '# Agents')
    write(directory, 'documentation/rules/pr-review-rules.md', '# Review')
    write(directory, 'src/old-name.ts', `${LINES.join('\n')}\n`)
    write(directory, 'src/plain.ts', 'export const plain = 1\nexport const other = 2\n')
    write(directory, 'src/moved/before.ts', `${LINES.join('\n')}\n`)
    baseSha = commit(directory, 'base')

    git(directory, 'mv', 'src/old-name.ts', 'src/new-name.ts')
    write(
      directory,
      'src/new-name.ts',
      `${[...LINES, 'export const added = true'].join('\n')}\n`,
    )
    write(directory, 'src/plain.ts', 'export const plain = 1\nexport const other = 3\n')
    mkdirSync(join(directory, 'src/excluded'), { recursive: true })
    git(directory, 'mv', 'src/moved/before.ts', 'src/excluded/after.ts')
    headSha = commit(directory, 'head')
  })

  afterAll(() => {
    rmSync(directory, { recursive: true, force: true })
  })

  it('keeps a rename with both paths in the files, the diff and the deleted files', () => {
    const input = new ReviewInputFaker({ repositoryRoot: directory }).fake(
      buildEvalCase(baseSha, headSha),
    )

    expect(input.changed_files).toEqual([
      'src/excluded/after.ts',
      'src/moved/before.ts',
      'src/new-name.ts',
      'src/old-name.ts',
      'src/plain.ts',
    ])
    expect(input.diff).toContain('rename from src/old-name.ts')
    expect(input.diff).toContain('rename to src/new-name.ts')
    expect(input.regression_facts.deleted_files).toEqual([
      'src/moved/before.ts',
      'src/old-name.ts',
    ])
    expect(input.changed_lines).toContainEqual({ path: 'src/new-name.ts', line: 21 })
    expect(input.changed_lines).toContainEqual({ path: 'src/plain.ts', line: 2 })
    expect(input.changed_lines.map(({ path }) => path)).not.toContain('src/old-name.ts')
  })

  it('drops an excluded rename and keeps a plain change', () => {
    const input = new ReviewInputFaker({ repositoryRoot: directory }).fake(
      buildEvalCase(baseSha, headSha, ['src/old-name.ts', 'src/new-name.ts']),
    )

    expect(input.changed_files).not.toContain('src/new-name.ts')
    expect(input.changed_files).not.toContain('src/old-name.ts')
    expect(input.changed_files).toContain('src/plain.ts')
    expect(input.diff).toContain('diff --git a/src/plain.ts b/src/plain.ts')
    expect(input.diff).not.toContain('rename from src/old-name.ts')
    expect(input.regression_facts.deleted_files).not.toContain('src/old-name.ts')
  })

  it('degrades a rename into the included side when the other path is excluded', () => {
    const input = new ReviewInputFaker({ repositoryRoot: directory }).fake(
      buildEvalCase(baseSha, headSha, ['src/excluded/']),
    )

    expect(input.changed_files).toContain('src/moved/before.ts')
    expect(input.changed_files).not.toContain('src/excluded/after.ts')
    expect(input.regression_facts.deleted_files).toContain('src/moved/before.ts')
    expect(input.diff).toContain('deleted file mode')
  })
})
