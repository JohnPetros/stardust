import { spawnSync } from 'node:child_process'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { AppError } from '@/errors/app-error'

import type { EvalCase } from '@/mastra/agents/pr-reviewer/types/eval-case'
import type { ReviewInput } from '@/mastra/agents/pr-reviewer/types/review-input'

const MAX_DIFF_BYTES = 180_000
const GIT_MAX_BUFFER = 256 * 1024 * 1024
const SNAPSHOT_PATTERN =
  /^apps\/server\/src\/database\/drizzle\/migrations\/meta\/[0-9]+_snapshot\.json$/
const MIGRATION_PATTERN = /(^|\/)migrations\//

type ReviewInputFakerDependencies = {
  repositoryRoot?: string
}

type AddedLine = { path: string; line: number }

type FileChange = { path: string; previousPath?: string; isDeleted: boolean }

export class ReviewInputFaker {
  private readonly repositoryRoot: string | undefined

  constructor({ repositoryRoot }: ReviewInputFakerDependencies = {}) {
    this.repositoryRoot = repositoryRoot
  }

  fake(evalCase: EvalCase): ReviewInput {
    const root =
      this.repositoryRoot ??
      this.runGit(process.cwd(), ['rev-parse', '--show-toplevel']).toString('utf8').trim()
    const { base_sha: baseSha, head_sha: headSha } = evalCase

    this.assertCommitsExist(root, evalCase)

    const mergeBase = this.runGit(root, ['merge-base', baseSha, headSha])
      .toString('utf8')
      .trim()
    const changes = this.listScopedChanges(root, mergeBase, evalCase)
    const scopedFiles = this.listChangedFiles(changes)
    const diff = this.buildDiff(root, mergeBase, evalCase, changes)
    const changedLines = this.listChangedLines(root, mergeBase, headSha, diff)
    const deletedFiles = this.listDeletedFiles(changes)
    const [owner, repo, pullNumber] = evalCase.source_pr.split(/[/#]/)

    return {
      repository: `${owner}/${repo}`,
      pull_number: Number(pullNumber),
      base_sha: baseSha,
      head_sha: headSha,
      range_base_sha: baseSha,
      review_mode: 'full',
      agents_md: readFileSync(join(root, 'AGENTS.md'), 'utf8'),
      review_md: readFileSync(
        join(root, 'documentation', 'rules', 'pr-review-rules.md'),
        'utf8',
      ),
      changed_files: scopedFiles,
      changed_lines: changedLines,
      diff,
      regression_facts: {
        deleted_files: deletedFiles,
        changed_migrations: scopedFiles.filter((path) => MIGRATION_PATTERN.test(path)),
      },
    }
  }

  private assertCommitsExist(root: string, evalCase: EvalCase) {
    for (const sha of [evalCase.base_sha, evalCase.head_sha]) {
      if (!this.hasCommit(root, sha)) {
        throw new AppError(
          `Commit ${sha} (dataset ${evalCase.name}) is not in this repository. The evals need the full git history: run "git fetch --unshallow" or "git fetch origin", or check out with fetch-depth: 0.`,
          'Commit ausente',
          { code: 'eval_commit_missing' },
        )
      }
    }
  }

  private listScopedChanges(
    root: string,
    mergeBase: string,
    evalCase: EvalCase,
  ): FileChange[] {
    const excluded = evalCase.excluded_path_prefixes ?? []
    const isIncluded = (path: string) =>
      !excluded.some((prefix) => path.startsWith(prefix))

    return this.parseNameStatus(
      this.runGit(root, [
        'diff',
        '--name-status',
        '-z',
        '--find-renames',
        '--no-ext-diff',
        '--no-textconv',
        mergeBase,
        evalCase.head_sha,
      ]),
    )
      .flatMap((change) => this.scopeChange(change, isIncluded))
      .sort((first, second) => this.compareBytes(first.path, second.path))
  }

  private parseNameStatus(output: Buffer): FileChange[] {
    const tokens = output.toString('utf8').split('\0')
    const changes: FileChange[] = []
    let index = 0

    while (index < tokens.length && tokens[index] !== '') {
      const status = tokens[index]

      if (status.startsWith('R')) {
        changes.push({
          path: tokens[index + 2],
          previousPath: tokens[index + 1],
          isDeleted: false,
        })
        index += 3
      } else {
        changes.push({ path: tokens[index + 1], isDeleted: status === 'D' })
        index += 2
      }
    }

    return changes
  }

  private scopeChange(
    change: FileChange,
    isIncluded: (path: string) => boolean,
  ): FileChange[] {
    const { path, previousPath } = change

    if (previousPath === undefined) return isIncluded(path) ? [change] : []
    if (isIncluded(path) && isIncluded(previousPath)) return [change]
    if (isIncluded(previousPath)) return [{ path: previousPath, isDeleted: true }]

    return isIncluded(path) ? [{ path, isDeleted: false }] : []
  }

  private listChangedFiles(changes: FileChange[]): string[] {
    return [
      ...new Set(
        changes.flatMap(({ path, previousPath }) => [path, previousPath ?? path]),
      ),
    ].sort((first, second) => this.compareBytes(first, second))
  }

  private buildDiff(
    root: string,
    mergeBase: string,
    evalCase: EvalCase,
    changes: FileChange[],
  ): string {
    const headSha = evalCase.head_sha
    let snapshotsById: Map<string, Buffer> | undefined
    const getSnapshots = () => {
      snapshotsById ??= this.indexSnapshots(root, headSha)

      return snapshotsById
    }

    const diffChunks = changes.map(({ path, previousPath }) => {
      const isNewSnapshot =
        previousPath === undefined &&
        SNAPSHOT_PATTERN.test(path) &&
        spawnSync('git', ['cat-file', '-e', `${mergeBase}:${path}`], { cwd: root })
          .status !== 0

      return isNewSnapshot
        ? this.diffSnapshot(root, headSha, path, getSnapshots)
        : this.runGit(root, [
            'diff',
            '--find-renames',
            '--unified=10',
            '--no-color',
            '--no-ext-diff',
            '--no-textconv',
            mergeBase,
            headSha,
            '--',
            ...(previousPath === undefined ? [path] : [previousPath, path]),
          ])
    })
    const diff = Buffer.concat(diffChunks).toString('utf8')

    if (Buffer.byteLength(diff, 'utf8') > MAX_DIFF_BYTES) {
      throw new AppError(
        `The review diff of dataset ${evalCase.name} has ${Buffer.byteLength(diff, 'utf8')} bytes; the limit is ${MAX_DIFF_BYTES}.`,
        'Diff grande demais',
        { code: 'eval_diff_too_large' },
      )
    }

    return diff
  }

  private listChangedLines(
    root: string,
    mergeBase: string,
    headSha: string,
    diff: string,
  ): AddedLine[] {
    const pullRequestLines = new Set(
      this.extractAddedLines(
        this.runGit(root, [
          'diff',
          '--unified=0',
          '--find-renames',
          '--no-color',
          '--no-ext-diff',
          '--no-textconv',
          mergeBase,
          headSha,
        ]).toString('utf8'),
      ).map((addedLine) => this.toLineKey(addedLine)),
    )

    return [
      ...new Map(
        this.extractAddedLines(diff)
          .filter((addedLine) => pullRequestLines.has(this.toLineKey(addedLine)))
          .map((addedLine) => [this.toLineKey(addedLine), addedLine]),
      ).values(),
    ].sort(
      (first, second) =>
        this.compareBytes(first.path, second.path) || first.line - second.line,
    )
  }

  private listDeletedFiles(changes: FileChange[]): string[] {
    return changes
      .flatMap(({ path, previousPath, isDeleted }) =>
        previousPath === undefined ? (isDeleted ? [path] : []) : [previousPath],
      )
      .sort((first, second) => this.compareBytes(first, second))
  }

  private indexSnapshots(root: string, headSha: string): Map<string, Buffer> {
    const snapshotsById = new Map<string, Buffer>()

    for (const candidate of this.splitLines(
      this.runGit(root, ['ls-tree', '-r', '--name-only', headSha]),
    )) {
      if (!SNAPSHOT_PATTERN.test(candidate)) continue

      const content = this.runGit(root, ['show', `${headSha}:${candidate}`])
      snapshotsById.set(JSON.parse(content.toString('utf8')).id, content)
    }

    return snapshotsById
  }

  private diffSnapshot(
    root: string,
    headSha: string,
    path: string,
    getSnapshots: () => Map<string, Buffer>,
  ): Buffer {
    const current = this.runGit(root, ['show', `${headSha}:${path}`])
    const previous = getSnapshots().get(JSON.parse(current.toString('utf8')).prevId)

    if (!previous) {
      throw new AppError(
        `Snapshot predecessor missing for ${path}.`,
        'Snapshot ausente',
        { code: 'eval_snapshot_predecessor_missing' },
      )
    }

    const directory = mkdtempSync(join(tmpdir(), 'crew-snapshot-diff-'))

    try {
      writeFileSync(join(directory, 'previous.json'), previous)
      writeFileSync(join(directory, 'current.json'), current)
      const result = spawnSync(
        'diff',
        [
          '-U10',
          '--label',
          `a/${path}`,
          '--label',
          `b/${path}`,
          join(directory, 'previous.json'),
          join(directory, 'current.json'),
        ],
        { maxBuffer: GIT_MAX_BUFFER },
      )

      return Buffer.concat([
        Buffer.from(`diff --git a/${path} b/${path}\n`),
        result.stdout,
      ])
    } finally {
      rmSync(directory, { recursive: true, force: true })
    }
  }

  private compareBytes(first: string, second: string): number {
    return Buffer.compare(Buffer.from(first), Buffer.from(second))
  }

  private runGit(repositoryRoot: string, args: string[], allowFailure = false): Buffer {
    const result = spawnSync('git', ['-c', 'core.quotePath=false', ...args], {
      cwd: repositoryRoot,
      maxBuffer: GIT_MAX_BUFFER,
    })

    if (result.status !== 0 && !allowFailure) {
      throw new AppError(
        `git ${args.slice(0, 3).join(' ')} failed: ${result.stderr?.toString().trim().slice(0, 200)}`,
        'Erro de Git',
        { code: 'eval_git_failed' },
      )
    }

    return result.stdout ?? Buffer.alloc(0)
  }

  private hasCommit(repositoryRoot: string, sha: string): boolean {
    return (
      spawnSync('git', ['cat-file', '-e', `${sha}^{commit}`], { cwd: repositoryRoot })
        .status === 0
    )
  }

  private splitLines(output: Buffer): string[] {
    return output
      .toString('utf8')
      .split('\n')
      .filter((line) => line !== '')
  }

  private extractAddedLines(diff: string): AddedLine[] {
    const addedLines: AddedLine[] = []
    let oldLeft = 0
    let newLeft = 0
    let path = ''
    let newLine = 0

    for (const line of diff.split('\n')) {
      if (oldLeft <= 0 && newLeft <= 0) {
        if (line.startsWith('+++ ')) {
          const candidate = line.slice(4).replace(/\t.*$/, '')
          path = candidate === '/dev/null' ? '' : candidate.replace(/^b\//, '')
        } else if (line.startsWith('@@ ')) {
          const [oldRange, newRange] = line.slice('@@ -'.length).split(' ')
          const [, oldCount] = oldRange.split(',')
          const [newStart, newCount] = newRange.replace(/^\+/, '').split(',')

          oldLeft = oldCount === undefined ? 1 : Number(oldCount)
          newLine = Number(newStart)
          newLeft = newCount === undefined ? 1 : Number(newCount)
        }
        continue
      }

      const marker = line.slice(0, 1)

      if (marker === '+') {
        if (path) addedLines.push({ path, line: newLine })
        newLine++
        newLeft--
      } else if (marker === ' ' || line === '') {
        newLine++
        newLeft--
        oldLeft--
      } else if (marker === '-') {
        oldLeft--
      }
    }

    return addedLines
  }

  private toLineKey({ path, line }: AddedLine): string {
    return `${path}\t${line}`
  }
}
