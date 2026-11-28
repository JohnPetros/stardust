import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  executeSteps,
  exitCodeFor,
  parseArguments,
  planChecks,
  RELATED_TESTS_LIMIT,
} from '../check-changed.mjs'

const SCRIPT = fileURLToPath(new URL('../check-changed.mjs', import.meta.url))
const USE_CASE = 'packages/core/src/ranking/use-cases/GetRankingUseCase.ts'
const USE_CASE_TEST =
  'packages/core/src/ranking/use-cases/tests/GetRankingUseCase.test.ts'
const CONTROLLER = 'apps/server/src/rest/controllers/auth/SignInController.ts'
const ROUTE_TEST = 'apps/server/src/tests/hono/routes/auth/SignInRoute.test.ts'
const PAGE = 'apps/web/src/app/(home)/space/[galaxySlug]/page.tsx'

function plan(paths, options = {}) {
  const changes = paths.map((path) =>
    typeof path === 'string' ? { path, deleted: false } : path,
  )
  return planChecks(changes, {
    base: 'abc',
    isDockerRunning: true,
    exists: () => false,
    listRelated: () => [],
    useCases: ['src/ranking/use-cases/GetRankingUseCase.ts'],
    ...options,
  })
}

const labels = ({ steps }) => steps.map(({ label }) => label)
const find = ({ steps }, label) => steps.find((step) => step.label === label)
const command = (result, label) => find(result, label)?.command.join(' ')
const related = (...files) => ({ listRelated: () => files })
const manyTests = (count) =>
  Array.from({ length: count }, (_, index) => `src/tests/test-${index}.test.ts`)

test('checks a changed use case, its consumers and its mutants', () => {
  const result = plan([USE_CASE], related('src/ranking/a.test.ts'))

  assert.deepEqual(labels(result), [
    'Lint',
    'Complexity',
    'Types: packages/core',
    'Types: packages/validation',
    'Types: packages/lsp',
    'Types: apps/server',
    'Types: apps/web',
    'Types: apps/backoffice',
    'Architecture',
    'Tests: packages/core',
    'Changed-lines coverage: packages/core',
    'Mutation: changed use cases',
  ])
  assert.equal(
    command(result, 'Tests: packages/core'),
    'pnpm --filter @stardust/core exec jest --runTestsByPath src/ranking/a.test.ts --coverage --coverageDirectory=coverage/changed --collectCoverageFrom=src/ranking/use-cases/GetRankingUseCase.ts',
  )
  assert.equal(
    command(result, 'Changed-lines coverage: packages/core'),
    'node scripts/check-changed-coverage.mjs core packages/core/coverage/changed/lcov.info --base abc --working-tree',
  )
  assert.match(
    command(result, 'Mutation: changed use cases'),
    /test:mutation --files src\/ranking\/use-cases\/GetRankingUseCase\.ts$/,
  )
  assert.match(result.notes.join('\n'), /tests of its consumers are not selected/)
})

test('runs a changed test without checking dependents or measuring coverage', () => {
  const result = plan([USE_CASE_TEST])

  assert.deepEqual(
    labels(result).filter((label) => label.startsWith('Types')),
    ['Types: packages/core'],
  )
  assert.equal(
    command(result, 'Tests: packages/core'),
    'pnpm --filter @stardust/core exec jest --runTestsByPath src/ranking/use-cases/tests/GetRankingUseCase.test.ts',
  )
  assert.ok(!labels(result).includes('Changed-lines coverage: packages/core'))
  assert.ok(labels(result).includes('Mutation: changed use cases'))
})

test('never plans a whole suite, even for shared configuration', () => {
  const result = plan([
    'pnpm-lock.yaml',
    'apps/web/jest.config.ts',
    'packages/core/package.json',
  ])

  assert.deepEqual(labels(result), [
    'Types: packages/core',
    'Types: apps/web',
    'Architecture',
  ])
  assert.match(result.notes.join('\n'), /Shared files changed \(pnpm-lock\.yaml/)
})

test('asks for a choice when the related tests are close to the whole suite', () => {
  const source = 'packages/core/src/global/domain/structures/Id.ts'
  const named = 'src/global/domain/structures/tests/Id.test.ts'
  const options = {
    exists: (path) => path === `packages/core/${named}`,
    ...related(...manyTests(RELATED_TESTS_LIMIT + 1)),
  }
  const result = plan([source], options)

  assert.match(
    command(result, 'Tests: packages/core'),
    new RegExp(`--runTestsByPath ${named} --`),
  )
  assert.match(
    find(result, 'Related tests: packages/core').skip,
    /41 test files import the changed files/,
  )
  assert.match(
    find(result, 'Changed-lines coverage: packages/core').skip,
    /selection is incomplete/,
  )
  assert.equal(exitCodeFor(executeSteps(result.steps, () => true)), 2)

  const chosen = plan([source], { ...options, tests: [`packages/core/${named}`] })
  assert.equal(find(chosen, 'Related tests: packages/core'), undefined)
  assert.equal(find(chosen, 'Changed-lines coverage: packages/core').skip, undefined)
  assert.match(chosen.notes.join('\n'), /Only the changed, named and requested tests/)
})

test('runs every related test up to the limit', () => {
  const result = plan([USE_CASE], related(...manyTests(RELATED_TESTS_LIMIT)))

  assert.equal(find(result, 'Related tests: packages/core'), undefined)
  assert.equal(
    find(result, 'Tests: packages/core').command.filter((item) =>
      item.endsWith('.test.ts'),
    ).length,
    RELATED_TESTS_LIMIT,
  )
})

test('skips the tests of a change that nothing imports', () => {
  const result = plan(['apps/web/src/ui/auth/widgets/a/useA.ts'])
  const results = executeSteps(result.steps, () => true)

  assert.match(results.get('Tests: apps/web').reason, /no test imports/)
  assert.equal(exitCodeFor(results), 2)
})

test('needs no test for declarations and barrels', () => {
  const result = plan([
    'packages/core/src/ranking/interfaces/TiersRepository.ts',
    'packages/core/src/ranking/use-cases/index.ts',
  ])

  assert.ok(!labels(result).some((label) => label.startsWith('Tests')))
})

test('measures route files whose folders look like glob patterns', () => {
  const result = plan([PAGE], related('src/app/(home)/space/tests/page.test.tsx'))

  assert.ok(
    find(result, 'Tests: apps/web').command.includes(
      '--collectCoverageFrom=src/app/\\(home\\)/space/\\[galaxySlug\\]/page.tsx',
    ),
  )
  assert.match(result.notes.join('\n'), /Playwright files/)
})

test('leaves the files Jest does not measure out of the coverage', () => {
  const result = plan(
    ['apps/server/src/rest/controllers/index.ts', 'apps/server/src/database/seed.ts'],
    related('src/a.test.ts'),
  )

  assert.doesNotMatch(command(result, 'Tests: apps/server'), /--coverage/)
  assert.ok(!labels(result).includes('Changed-lines coverage: apps/server'))
})

test('runs server integration tests only when asked, one file at a time', () => {
  const options = { ...related('src/a.test.ts'), tests: [ROUTE_TEST] }
  const without = plan([CONTROLLER], options)

  assert.match(command(without, 'Tests: apps/server'), /--selectProjects unit --run/)
  assert.doesNotMatch(command(without, 'Tests: apps/server'), /SignInRoute/)
  assert.match(
    find(without, 'Integration tests: apps/server').skip,
    /clear the local database/,
  )
  assert.match(
    find(without, 'Changed-lines coverage: apps/server').skip,
    /selection is incomplete/,
  )

  const included = plan([CONTROLLER], { ...options, integration: true })
  assert.match(
    command(included, 'Tests: apps/server'),
    /--selectProjects unit hono inngest --runTestsByPath src\/a\.test\.ts src\/tests\/hono\/routes\/auth\/SignInRoute\.test\.ts --runInBand/,
  )
  assert.ok(find(included, 'Tests: apps/server').env.INNGEST_DEV)
  assert.equal(
    find(included, 'Changed-lines coverage: apps/server').requires,
    'Tests: apps/server',
  )

  const stopped = plan([CONTROLLER], {
    ...options,
    integration: true,
    isDockerRunning: false,
  })
  assert.equal(
    find(stopped, 'Integration tests: apps/server').skip,
    'Docker is not running',
  )
})

test('builds the LSP package before the app tests when its output is missing', () => {
  const missing = plan([CONTROLLER], related('src/a.test.ts'))

  assert.ok(
    labels(missing).indexOf('Build: packages/lsp') <
      labels(missing).indexOf('Tests: apps/server'),
  )
  assert.equal(find(missing, 'Tests: apps/server').requires, 'Build: packages/lsp')

  const built = plan([CONTROLLER], {
    ...related('src/a.test.ts'),
    exists: (path) => path === 'packages/lsp/build/main.js',
  })
  assert.ok(!labels(built).includes('Build: packages/lsp'))
})

test('runs the Crew and LSP tests with their own runners', () => {
  const crew = plan(
    [
      'apps/crew/src/utils/number-diff-lines.ts',
      'apps/crew/src/controllers/tests/app.test.ts',
    ],
    related('src/utils/tests/number-diff-lines.test.ts'),
  )
  assert.match(
    command(crew, 'Tests: apps/crew'),
    /vitest run --project unit src\/utils\/tests\/number-diff-lines\.test\.ts$/,
  )
  assert.match(
    command(crew, 'Integration tests: apps/crew'),
    /--project integration src\/controllers\/tests\/app\.test\.ts$/,
  )
  assert.ok(labels(crew).includes('Architecture: apps/crew'))

  const lsp = plan(['packages/lsp/src/DeleguaLsp.ts'], {
    exists: (path) => path === 'packages/lsp/src/tests/DeleguaLsp.test.ts',
    listRelated: () => assert.fail('node:test has no dependency graph'),
  })
  assert.match(
    command(lsp, 'Tests: packages/lsp'),
    /node --import tsx --test src\/tests\/DeleguaLsp\.test\.ts$/,
  )
})

test('runs only the changed Playwright files', () => {
  const spec = 'apps/web/tests/auth/pages/sign-in.page.test.ts'
  const result = plan([spec], { exists: () => true })

  assert.equal(
    command(result, 'Playwright: apps/web'),
    'pnpm --filter @stardust/web run test:integration tests/auth/pages/sign-in.page.test.ts',
  )
  assert.ok(!labels(plan([PAGE])).includes('Playwright: apps/web'))
})

test('runs the tests of changed scripts, and nothing for documentation', () => {
  const result = plan(
    ['scripts/check-changed.mjs', 'scripts/tests/utils.test.mjs', 'scripts/orphan.mjs'],
    {
      exists: (path) =>
        ['scripts/tests/check-changed.test.mjs', 'scripts/tests/utils.test.mjs'].includes(
          path,
        ),
    },
  )

  assert.equal(
    command(result, 'Script tests'),
    'node --test scripts/tests/check-changed.test.mjs scripts/tests/utils.test.mjs',
  )
  assert.match(result.notes.join('\n'), /named after scripts\/orphan\.mjs/)
  assert.deepEqual(plan(['documentation/tooling.md']), { steps: [], notes: [] })
})

test('checks the workspace of a deleted file without naming it', () => {
  const result = plan([{ path: USE_CASE, deleted: true }], { useCases: [] })

  assert.ok(!labels(result).includes('Lint'))
  assert.ok(!labels(result).includes('Tests: packages/core'))
  assert.ok(labels(result).includes('Types: apps/web'))
})

test('checks test integrity only when a test changes', () => {
  assert.ok(labels(plan([USE_CASE_TEST])).includes('Test integrity'))
  assert.ok(
    labels(plan([{ path: USE_CASE_TEST, deleted: true }])).includes('Test integrity'),
  )
  assert.ok(labels(plan(['scripts/tests/utils.test.mjs'])).includes('Test integrity'))
  assert.ok(!labels(plan([USE_CASE, 'scripts/utils.mjs'])).includes('Test integrity'))
})

test('skips what depends on a failed step and reports the failure first', () => {
  const results = executeSteps(
    [
      { label: 'tests', command: ['a'] },
      { label: 'coverage', command: ['b'], requires: 'tests' },
    ],
    () => false,
  )

  assert.deepEqual(
    [...results.values()].map(({ status }) => status),
    ['FAIL', 'SKIPPED'],
  )
  assert.equal(exitCodeFor(results), 1)
})

test('asks for review of a finished mutation run instead of passing it', () => {
  const results = executeSteps(
    plan([USE_CASE], related('src/a.test.ts')).steps,
    () => true,
  )

  assert.equal(results.get('Mutation: changed use cases').status, 'REVIEW')
  assert.equal(exitCodeFor(results), 0)
})

test('reads its options and rejects anything else', () => {
  assert.deepEqual(parseArguments([]), {
    base: 'origin/main',
    dryRun: false,
    integration: false,
    tests: [],
  })
  assert.deepEqual(
    parseArguments([
      '--',
      '--tests',
      'a',
      'b',
      '--base',
      'main',
      '--integration',
      '--dry-run',
    ]),
    { base: 'main', dryRun: true, integration: true, tests: ['a', 'b'] },
  )
  assert.throws(() => parseArguments(['--tests']), /Usage/)
  assert.throws(() => parseArguments(['--all']), /Usage/)
  assert.throws(() => plan([], { tests: [CONTROLLER] }), /Not a test file/)
  assert.throws(
    () => plan([], { tests: ['apps/crew/src/mastra/agents/a/tests/a.test.ts'] }),
    /Not a test file/,
  )
})

test('lists the planned checks without running them', () => {
  const run = spawnSync(process.execPath, [SCRIPT, '--base', 'HEAD', '--dry-run'], {
    encoding: 'utf8',
  })

  assert.equal(run.status, 0, run.stderr)
  assert.match(run.stdout, /changed file\(s\) since [0-9a-f]{8}/)
})
