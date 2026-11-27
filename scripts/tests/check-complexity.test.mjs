import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  checkComplexity,
  compareFunctions,
  isProductionSource,
  pairFunctions,
  parseArguments,
  parseNameStatus,
  renderComplexity,
} from '../check-complexity.mjs'

const SCRIPT = fileURLToPath(new URL('../check-complexity.mjs', import.meta.url))
const LIMITS = {
  cyclomaticComplexity: [8, 15],
  cognitiveComplexity: [12, 25],
  functionLength: [35, 70],
  nestingDepth: [3, 4],
  halsteadVolume: [400, 800],
}

function createFunction(name, values = {}, startLine = 1) {
  return {
    name,
    startLine,
    metrics: Object.entries(LIMITS).map(([metric, [warn, error]]) => {
      const value = values[metric] ?? 1
      const severity = value > error ? 'error' : value > warn ? 'warn' : 'ok'
      return { name: metric, value, threshold: error, severity }
    }),
  }
}

function judge(metric, before, after) {
  const previous = before === undefined ? [] : [createFunction('a', { [metric]: before })]
  return compareFunctions(previous, [createFunction('a', { [metric]: after })])
}

test('blocks a new function only when it is over an error limit', () => {
  assert.equal(judge('functionLength', undefined, 71).violations.length, 1)
  const warning = judge('functionLength', undefined, 70)
  assert.deepEqual(warning.violations, [])
  assert.equal(warning.warnings.length, 1)
})

test('blocks an existing function that goes over an error limit', () => {
  const [violation] = judge('cyclomaticComplexity', 15, 16).violations

  assert.equal(violation.reason, 'Went over the error limit')
  assert.equal(violation.allowed, 15)
})

test('lists a move from ok to warning without blocking it', () => {
  const moved = judge('cognitiveComplexity', 12, 13)
  assert.deepEqual(moved.violations, [])
  assert.equal(moved.warnings.length, 1)
  assert.deepEqual(judge('cognitiveComplexity', 13, 20).warnings, [])
})

test('lets size metrics over the limit grow by at most 10%', () => {
  assert.deepEqual(judge('functionLength', 100, 110).violations, [])
  assert.equal(judge('functionLength', 100, 111).violations.length, 1)
  assert.deepEqual(judge('halsteadVolume', 1000, 1100).violations, [])
  assert.equal(judge('halsteadVolume', 1000, 1100.01).violations.length, 1)
})

test('blocks any growth of logic metrics over the limit', () => {
  for (const [metric, value] of [
    ['cyclomaticComplexity', 30],
    ['cognitiveComplexity', 40],
    ['nestingDepth', 6],
  ]) {
    assert.equal(judge(metric, value, value + 1).violations.length, 1, metric)
    assert.deepEqual(judge(metric, value, value).violations, [], metric)
    assert.deepEqual(judge(metric, value, value - 1).violations, [], metric)
  }
})

test('pairs functions by name wherever they moved', () => {
  const before = [
    createFunction('<anonymous>', { functionLength: 90 }, 10),
    createFunction('<anonymous>', { functionLength: 5 }, 20),
  ]
  const after = [
    createFunction('<anonymous>', { functionLength: 6 }, 40),
    createFunction('<anonymous>', { functionLength: 90 }, 80),
    createFunction('added', {}, 1),
  ]

  const pairs = pairFunctions(before, after)

  assert.equal(pairs.get(after[0]), before[1])
  assert.equal(pairs.get(after[1]), before[0])
  assert.equal(pairs.get(after[2]), undefined)
})

test('selects production source for each scope', () => {
  assert.ok(isProductionSource('apps/web/src/ui/page.tsx'))
  assert.ok(
    isProductionSource('packages/email/templates/identity/a.tsx', 'packages/email'),
  )
  assert.ok(!isProductionSource('apps/web/src/ui/page.tsx', 'apps/server'))
  assert.ok(!isProductionSource('apps/server/src/page.tsx'))
  assert.ok(!isProductionSource('apps/web/src/routeTree.gen.ts'))
  assert.ok(!isProductionSource('apps/web/src/ui/tests/helper.ts'))
  assert.ok(!isProductionSource('packages/core/src/a.test.ts'))
  assert.ok(!isProductionSource('scripts/check-complexity.mjs'))
  assert.ok(isProductionSource('apps/backoffice/src/ui/page.tsx', 'apps/backoffice'))
  assert.ok(isProductionSource('packages/lsp/src/main.ts', 'packages/lsp'))
  assert.ok(!isProductionSource('apps/server/src/database/supabase/types/Database.ts'))
})

test('reads added, deleted, modified and renamed paths', () => {
  assert.deepEqual(parseNameStatus('A\0a\0D\0d\0M\0m\0R087\0old\0new\0'), [
    { basePath: undefined, headPath: 'a' },
    { basePath: 'd', headPath: undefined },
    { basePath: 'm', headPath: 'm' },
    { basePath: 'old', headPath: 'new' },
  ])
})

test('compares with origin/main unless a base is given', () => {
  assert.deepEqual(parseArguments([]), { base: 'origin/main' })
  assert.deepEqual(parseArguments(['--scope', 'apps/web', '--', '--base', 'HEAD^1']), {
    scope: 'apps/web',
    base: 'HEAD^1',
  })
  assert.throws(
    () => parseArguments(['--scope', 'apps/unknown']),
    /Unknown complexity scope/,
  )
  assert.throws(() => parseArguments(['--base']), /Usage/)
  assert.throws(() => parseArguments(['--update-baseline', 'x']), /Unknown option/)
})

// A function over the length limit: the signature, `lines` statements and the braces.
function createSource(name, lines) {
  const body = Array.from({ length: lines }, () => '  total += 1')
  return [`export function ${name}(total: number) {`, ...body, '}', ''].join('\n')
}

function createRepository(context) {
  const root = mkdtempSync(join(tmpdir(), 'stardust-complexity-test-'))
  context.after(() => rmSync(root, { recursive: true, force: true }))
  const git = (...argumentsList) =>
    execFileSync('git', argumentsList, { cwd: root, encoding: 'utf8' })
  const write = (path, content) => {
    mkdirSync(dirname(join(root, path)), { recursive: true })
    writeFileSync(join(root, path), content)
  }
  git('init', '--quiet', '--initial-branch=main')
  git('config', 'user.email', 'test@example.com')
  git('config', 'user.name', 'Test')
  git('config', 'commit.gpgsign', 'false')
  write('.code-multivitals.json', JSON.stringify({ thresholds: {} }))
  write('packages/core/src/legacy.ts', createSource('legacy', 90))
  git('add', '.')
  git('commit', '--quiet', '-m', 'base')
  return { root, git, write }
}

test('follows a renamed file and reads the working tree', (context) => {
  const { root, write } = createRepository(context)
  renameSync(
    join(root, 'packages/core/src/legacy.ts'),
    join(root, 'packages/core/src/renamed.ts'),
  )
  execFileSync('git', ['add', '--all'], { cwd: root })

  const moved = checkComplexity({ root, base: 'main' })
  assert.equal(moved.files, 1)
  assert.deepEqual(moved.violations, [])

  write('packages/core/src/untracked.ts', createSource('untracked', 90))
  const added = checkComplexity({ root, base: 'main' })
  assert.deepEqual(
    added.violations.map(({ path, name }) => [path, name]),
    [['packages/core/src/untracked.ts', 'untracked']],
  )
})

test('compares two revisions from their merge base', (context) => {
  const { root, git, write } = createRepository(context)
  git('switch', '--quiet', '-c', 'feature')
  write('packages/core/src/legacy.ts', createSource('legacy', 110))
  git('commit', '--quiet', '-am', 'grow')
  git('switch', '--quiet', 'main')
  write('packages/core/src/other.ts', createSource('other', 90))
  git('add', '.')
  git('commit', '--quiet', '-m', 'target branch advances')

  const result = checkComplexity({ root, base: 'main', head: 'feature' })

  assert.equal(result.files, 1)
  assert.deepEqual(
    result.violations.map(({ metric, before, after }) => [metric, before, after]),
    [['functionLength', 92, 112]],
  )
  const markdown = renderComplexity('packages/core', result)
  assert.match(markdown, /\*\*FAIL\*\*/)
  assert.match(markdown, /Function length \| 92 \| 112 \| ≤ 101\.2 \|/)
})

test('fails closed on a missing base and on source it cannot parse', (context) => {
  const { root, write } = createRepository(context)
  assert.throws(() => checkComplexity({ root, base: 'missing' }), /merge base/)

  write('packages/core/src/broken.ts', 'export function (')
  assert.throws(() => checkComplexity({ root, base: 'main' }), /Cannot parse/)
})

test('treats a file the base could not parse as new', (context) => {
  const { root, git, write } = createRepository(context)
  write('packages/core/src/fixed.ts', 'export const same = <T>(value: T) => value\n')
  git('add', '.')
  git('commit', '--quiet', '-m', 'unreadable')
  write('packages/core/src/fixed.ts', createSource('fixed', 90))

  const { violations } = checkComplexity({ root, base: 'main' })

  assert.deepEqual(
    violations.map(({ name, before }) => [name, before]),
    [['fixed', undefined]],
  )
})

test('exits with a usage error for an unknown option', () => {
  const run = spawnSync(process.execPath, [SCRIPT, '--nope', 'x'], { encoding: 'utf8' })

  assert.equal(run.status, 1)
  assert.match(run.stderr, /Unknown option/)
})

// Runs the command with its own step files, so a CI run of this test leaves the real
// job summary and step outputs alone.
function runScript(context, argumentsList) {
  const directory = mkdtempSync(join(tmpdir(), 'stardust-complexity-run-'))
  context.after(() => rmSync(directory, { recursive: true, force: true }))
  const paths = Object.fromEntries(
    ['report', 'summary', 'output'].map((name) => [name, join(directory, name)]),
  )
  const run = spawnSync(
    process.execPath,
    [SCRIPT, ...argumentsList, '--output', paths.report],
    {
      encoding: 'utf8',
      env: {
        ...process.env,
        GITHUB_OUTPUT: paths.output,
        GITHUB_STEP_SUMMARY: paths.summary,
      },
    },
  )
  const read = (name) => readFileSync(paths[name], 'utf8')
  return { status: run.status, read }
}

test('writes the report and says there is nothing to comment on', (context) => {
  const run = runScript(context, ['--base', 'HEAD', '--head', 'HEAD'])

  assert.equal(run.status, 0)
  assert.match(run.read('report'), /Compared 0 changed source file\(s\)/)
  assert.match(run.read('summary'), /\*\*PASS\*\*/)
  assert.equal(run.read('output'), 'findings=false\n')
})

test('reports a gate that could not run as a finding', (context) => {
  const run = runScript(context, ['--base', 'missing-ref'])

  assert.equal(run.status, 1)
  assert.match(run.read('report'), /could not measure the change[\s\S]*merge base/)
  assert.equal(run.read('output'), 'findings=true\n')
})
