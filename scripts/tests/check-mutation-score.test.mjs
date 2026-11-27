import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  collectReports,
  compareFiles,
  compareModules,
  groupByModule,
  parseArguments,
  parseChangedFiles,
  readFileScores,
} from '../check-mutation-score.mjs'

const SCRIPT = fileURLToPath(new URL('../check-mutation-score.mjs', import.meta.url))
const PATH = 'src/shop/use-cases/BuyRocketUseCase.ts'

function result(counts = {}) {
  return {
    killed: 0,
    timeout: 0,
    survived: 0,
    noCoverage: 0,
    ignored: 0,
    errors: 0,
    ...counts,
  }
}

const score = (killed, survived) => result({ killed, survived })

function judge(current, previous, status) {
  const files = (value) => new Map(value ? [[PATH, value]] : [])
  const changed = new Map(status ? [[PATH, status]] : [])
  const [row] = compareFiles(files(current), files(previous), changed, 70)
  return row.passed
}

function report(files) {
  return JSON.stringify({
    files: Object.fromEntries(
      Object.entries(files).map(([path, statuses]) => [
        path,
        { mutants: statuses.map((status) => ({ status })) },
      ]),
    ),
  })
}

function createDirectory(context) {
  const directory = mkdtempSync(join(tmpdir(), 'stardust-mutation-'))
  context.after(() => rmSync(directory, { recursive: true, force: true }))
  return directory
}

function writeFile(root, path, content) {
  const target = join(root, path)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
  return target
}

test('requires the threshold from new files', () => {
  assert.equal(judge(score(7, 3), undefined, 'A'), true)
  assert.equal(judge(score(6, 4), undefined, 'A'), false)
  assert.equal(judge(result({ errors: 2 }), undefined, 'A'), false)
  assert.equal(judge(undefined, undefined, 'A'), false)
})

test('keeps a changed file that was at the threshold at or above it', () => {
  assert.equal(judge(score(7, 3), score(9, 1), 'M'), true)
  assert.equal(judge(score(6, 4), score(7, 3), 'M'), false)
})

test('lets a changed file below the threshold pass when it does not drop', () => {
  assert.equal(judge(score(1, 1), score(1, 1), 'M'), true)
  assert.equal(judge(score(2, 3), score(1, 1), 'M'), false)
  assert.equal(judge(score(7, 3), score(0, 1), 'M'), true)
  assert.equal(judge(score(0, 4), score(0, 2), 'M'), true)
})

test('forbids any drop in an unchanged file, without rounding', () => {
  assert.equal(judge(score(2, 1), score(2, 1)), true)
  assert.equal(judge(score(99_999, 50_001), score(2, 1)), false)
  assert.equal(judge(undefined, score(2, 1)), false)
  assert.equal(judge(score(2, 1), undefined), false)
  assert.equal(judge(result({ errors: 3 }), score(2, 1)), false)
})

test('passes deleted files and files without mutants', () => {
  assert.equal(judge(undefined, score(1, 0), 'D'), true)
  assert.equal(judge(result(), result(), 'M'), true)
  assert.equal(judge(result(), undefined, 'A'), true)
  assert.equal(judge(result(), result()), true)
})

test('counts timeouts as detected and uncovered mutants against the score', () => {
  assert.equal(judge(result({ timeout: 7, noCoverage: 3, ignored: 90 }), null, 'A'), true)
  assert.equal(judge(result({ killed: 6, noCoverage: 4 }), null, 'A'), false)
})

test('requires the threshold from a module unless it was already below it', () => {
  const judgeModule = (current, previous) => {
    const modules = (value) => new Map(value ? [['shop', value]] : [])
    return compareModules(modules(current), modules(previous), 70)[0].result
  }

  assert.equal(judgeModule(score(7, 3), score(9, 1)), 'PASS')
  assert.equal(judgeModule(score(6, 4), score(9, 1)), 'FAIL')
  assert.equal(judgeModule(score(1, 1), score(1, 1)), 'PASS (no drop)')
  assert.equal(judgeModule(score(1, 2), score(1, 1)), 'FAIL')
  assert.equal(judgeModule(score(0, 2), score(0, 2)), 'PASS (no drop)')
  assert.equal(judgeModule(score(1, 1), undefined), 'FAIL')
  assert.equal(judgeModule(undefined, score(1, 1)), 'PASS (removed)')
})

test('merges shard reports and classifies every status', (context) => {
  const root = createDirectory(context)
  writeFile(
    root,
    'one/mutation.json',
    report({ [PATH]: ['Killed', 'Timeout', 'Survived', 'NoCoverage', 'Pending'] }),
  )
  writeFile(
    root,
    'two/mutation.json',
    report({
      'src/shop/use-cases/ListRocketsUseCase.ts': [
        'Ignored',
        'RuntimeError',
        'CompileError',
      ],
    }),
  )

  const files = readFileScores(collectReports(root, 2))

  assert.deepEqual(
    files.get(PATH),
    result({ killed: 1, timeout: 1, survived: 2, noCoverage: 1 }),
  )
  assert.deepEqual(
    groupByModule(files).get('shop'),
    result({
      killed: 1,
      timeout: 1,
      survived: 2,
      noCoverage: 1,
      ignored: 1,
      errors: 2,
    }),
  )
})

test('fails closed on missing, duplicated or out-of-scope report data', (context) => {
  const root = createDirectory(context)
  const first = writeFile(root, 'one/mutation.json', report({ [PATH]: ['Killed'] }))

  assert.throws(() => collectReports(root, 2), /Expected 2/)
  assert.throws(() => readFileScores([first, first]), /Duplicate/)
  const outside = writeFile(root, 'two.json', report({ 'src/shop/domain/Rocket.ts': [] }))
  assert.throws(() => readFileScores([outside]), /outside the scope/)
  const empty = writeFile(root, 'three.json', '{}')
  assert.throws(() => readFileScores([empty]), /files object/)
})

test('reads only use-case entries from the git diff', () => {
  const output = [
    'M',
    `packages/core/${PATH}`,
    'A',
    'packages/core/src/shop/domain/Rocket.ts',
    'D',
    'packages/core/src/shop/use-cases/OldUseCase.ts',
    '',
  ].join('\0')

  assert.deepEqual(
    [...parseChangedFiles(output)],
    [
      [PATH, 'M'],
      ['src/shop/use-cases/OldUseCase.ts', 'D'],
    ],
  )
})

test('requires both revisions and a valid threshold', () => {
  const required = ['--baseline-root', 'b', '--base-ref', 'a', '--head-ref', 'z']

  assert.equal(parseArguments(['c', ...required]).threshold, 70)
  assert.equal(parseArguments(['c', ...required]).shards, 4)
  assert.throws(() => parseArguments(['c']), /Usage/)
  assert.throws(() => parseArguments(['c', ...required, '--other', '1']), /Usage/)
  assert.throws(
    () => parseArguments(['c', ...required, '--threshold', '101']),
    /0 to 100/,
  )
})

test('fails the command and lists the files that dropped', (context) => {
  const root = createDirectory(context)
  const git = (...argumentsList) =>
    execFileSync('git', ['-C', root, ...argumentsList], { encoding: 'utf8' }).trim()
  git('init', '-q')
  git('config', 'user.email', 'test@example.com')
  git('config', 'user.name', 'Test')
  writeFile(root, `packages/core/${PATH}`, 'export const price = 1\n')
  git('add', '.')
  git('commit', '-qm', 'base')
  const base = git('rev-parse', 'HEAD')
  writeFile(root, `packages/core/${PATH}`, 'export const price = 2\n')
  git('commit', '-qam', 'head')
  writeFile(root, 'candidate/mutation.json', report({ [PATH]: ['Killed', 'Survived'] }))
  writeFile(root, 'baseline/mutation.json', report({ [PATH]: ['Killed'] }))

  const run = spawnSync(
    process.execPath,
    [
      SCRIPT,
      'candidate',
      ...['--baseline-root', 'baseline', '--base-ref', base, '--head-ref', 'HEAD'],
      ...['--shards', '1', '--output', 'out/report.md', '--comment-output', 'out/c.md'],
    ],
    { cwd: root, encoding: 'utf8', env: { PATH: process.env.PATH } },
  )

  assert.equal(run.status, 1, run.stderr)
  const comment = readFileSync(join(root, 'out/c.md'), 'utf8')
  assert.match(
    comment,
    /^<!-- mutation-report:core -->\n## Core mutation score by module/,
  )
  assert.match(comment, /❌ The mutation score gate failed\./)
  assert.match(
    comment,
    /\| src\/shop\/use-cases\/BuyRocketUseCase\.ts \| new or changed: threshold \| 100\.00% \| 50\.00% \| FAIL \|/,
  )
  assert.match(readFileSync(join(root, 'out/report.md'), 'utf8'), /by use-case file/)
})
