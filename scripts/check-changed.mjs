// Runs the local checks for the code changed since the branch left the target branch.
// No step runs a whole test suite; see "Verificação do que mudou" in
// documentation/tooling.md.
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join, posix, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

import { listUseCases, selectChangedFiles } from './test-mutation.mjs'

const ROOT_DIRECTORY = fileURLToPath(new URL('..', import.meta.url))
// More related test files than this is close to a whole suite, which only runs on request.
export const RELATED_TESTS_LIMIT = 40

const APPS = ['apps/server', 'apps/web', 'apps/backoffice']
// Keys are in dependency order. `paths` mirrors each workspace's `check:code`, and
// `coverage` mirrors the files its Jest configuration measures.
const WORKSPACES = {
  'packages/core': {
    name: '@stardust/core',
    paths: ['src/'],
    dependents: ['packages/validation', 'packages/lsp', ...APPS],
    runner: 'jest',
    hasComplexity: true,
    hasRootArchitecture: true,
    coverage: {
      gate: 'core',
      measured: /\.ts$/,
      excluded: /\.test\.ts$|\/(?:tests|fakers)\//,
    },
  },
  'packages/validation': {
    name: '@stardust/validation',
    paths: ['src/'],
    dependents: APPS,
    hasComplexity: true,
  },
  'packages/lsp': {
    name: '@stardust/lsp',
    paths: ['src/'],
    dependents: APPS,
    runner: 'node',
    hasComplexity: true,
  },
  'packages/email': {
    name: '@stardust/email',
    paths: ['templates/', 'partials/'],
    dependents: ['apps/server'],
    hasComplexity: true,
  },
  'packages/studio': {
    name: '@stardust/studio',
    paths: ['src/', 'vite-plugins/', 'scripts/', 'vite.config.ts'],
  },
  'apps/server': {
    name: '@stardust/server',
    paths: ['src/'],
    runner: 'jest',
    projects: ['unit'],
    // These tests clear the local database, so they need --integration.
    integration: {
      pattern: /^src\/tests\/(?:hono\/routes|inngest\/functions)\//,
      projects: ['unit', 'hono', 'inngest'],
      env: {
        INNGEST_DEV: 'http://127.0.0.1:8288',
        INNGEST_BASE_URL: 'http://127.0.0.1:8288',
      },
    },
    hasComplexity: true,
    hasRootArchitecture: true,
    coverage: {
      gate: 'server',
      measured: /\.ts$/,
      excluded:
        /\.test\.ts$|\.d\.ts$|\/(?:tests|fakers|types)\/|\/index\.ts$|^src\/database\/(?:drizzle\/DatabaseAccess\.ts$|seed\.ts$|seeders\/)/,
    },
  },
  'apps/web': {
    name: '@stardust/web',
    paths: ['src/', 'tests/'],
    runner: 'jest',
    browserTests: /^tests\/.+\.test\.ts$/,
    hasComplexity: true,
    hasRootArchitecture: true,
    coverage: {
      gate: 'web',
      measured: /\.tsx?$/,
      excluded: /\.test\.tsx?$|\/(?:tests|__mocks__)\//,
    },
  },
  'apps/backoffice': {
    name: '@stardust/backoffice',
    paths: ['src/'],
    runner: 'jest',
    hasComplexity: true,
    hasRootArchitecture: true,
  },
  'apps/crew': {
    name: '@stardust/crew',
    paths: [
      'src/',
      'drizzle.config.ts',
      'vitest.config.mts',
      'vitest.evals.config.mts',
      '.dependency-cruiser.mjs',
      'package.json',
      'tsconfig.json',
    ],
    runner: 'vitest',
    // These tests start their own disposable containers.
    containerTests: /^src\/(?:mastra\/agents\/[^/]+\/)?controllers\/tests\//,
    // Evals call paid services.
    evals: /^src\/mastra\/agents\/[^/]+\/tests\//,
  },
}
const CODE_FILE = /\.[cm]?[jt]sx?$/
const LINTABLE_FILE = /\.(?:[cm]?[jt]sx?|jsonc?|css)$/
const TEST_FILE = /\.test\.(?:[cm]?[jt]sx?)$/
// Tests and their helpers, which other workspaces never import.
const OWN_TEST = /\.test\.(?:[cm]?[jt]sx?)$|(?:^|\/)tests\//
const TEST_SUPPORT = /(?:^|\/)(?:tests|__mocks__|fakers|fixtures)\//
// Declarations and barrels carry no behaviour of their own.
const NO_BEHAVIOUR = /(?:^|\/)index\.ts$|\.d\.ts$|\/(?:types|interfaces|dtos)\//
const WORKSPACE_CONFIG =
  /^(?:package\.json|tsconfig[^/]*\.json|[^/]*config[^/]*\.[cm]?[jt]s)$/
const SHARED_FILE =
  /^(?:package\.json|pnpm-lock\.yaml|pnpm-workspace\.yaml|turbo\.json|biome\.json|coverage-baseline\.json|test-integrity\.config\.mjs|\.dependency-cruiser\.cjs|tsconfig[^/]*\.json)$|^(?:apps|packages)\/[^/]+\/(?:[^/]*config[^/]*|package\.json|jest\.setup\.[jt]s)$|\/fixtures\//
const SERVER_BOUNDARY = /^apps\/server\/src\/(?:app\/hono|database|queue|rest)\//
const FRONTEND = /^apps\/(?:web|backoffice)\/src\/(?:ui|app)\//
const SCRIPT_TEST = /^scripts\/tests\/[^/]+\.test\.mjs$/
const DATABASE_SCRIPT_TEST = /\.integration\.test\.mjs$/
const USAGE =
  'Usage: pnpm run check:changed [--base <git-ref>] [--tests <test-file>...] [--integration] [--dry-run]'

function step(label, command, extra = {}) {
  return { label, command, ...extra }
}

function skipped(label, reason) {
  return step(label, [], { skip: reason })
}

function unique(values) {
  return [...new Set(values)].sort()
}

function isUnder(path, entries) {
  return entries.some((entry) =>
    entry.endsWith('/') ? path.startsWith(entry) : path === entry,
  )
}

function describeWorkspace(directory, changes) {
  const prefix = `${directory}/`
  const { paths } = WORKSPACES[directory]
  const own = changes
    .filter(({ path }) => path.startsWith(prefix))
    .map(({ path, deleted }) => ({ path: path.slice(prefix.length), deleted }))
  const code = own.filter(({ path }) => CODE_FILE.test(path) && isUnder(path, paths))
  return {
    directory,
    code,
    isChanged: code.length > 0 || own.some(({ path }) => WORKSPACE_CONFIG.test(path)),
    // Source that other workspaces can import may change what they compile against.
    changesContract: code.some(({ path }) => !OWN_TEST.test(path)),
  }
}

function planLint(existing) {
  const files = existing.filter((path) => {
    if (!LINTABLE_FILE.test(path)) return false
    return Object.entries(WORKSPACES).some(
      ([directory, { paths }]) =>
        path.startsWith(`${directory}/`) &&
        isUnder(path.slice(directory.length + 1), paths),
    )
  })
  if (!files.length) return []
  const command = ['pnpm', 'exec', 'biome', 'check', '--no-errors-on-unmatched']
  return [step('Lint', [...command, '--files-ignore-unknown=true', ...files])]
}

function planTypes(workspaces) {
  const typed = new Set()
  for (const { directory, isChanged, changesContract } of workspaces) {
    if (!isChanged) continue
    typed.add(directory)
    if (!changesContract) continue
    for (const dependent of WORKSPACES[directory].dependents ?? []) typed.add(dependent)
  }
  return Object.entries(WORKSPACES)
    .filter(([directory]) => typed.has(directory))
    .map(([directory, { name }]) =>
      step(`Types: ${directory}`, ['pnpm', '--filter', name, 'run', 'check:types']),
    )
}

// The root script is what the CI runs, and it already includes Crew.
function planArchitecture(changed) {
  if (changed.some(({ directory }) => WORKSPACES[directory].hasRootArchitecture)) {
    return [step('Architecture', ['pnpm', 'run', 'check:architecture'])]
  }
  if (!changed.some(({ directory }) => directory === 'apps/crew')) return []
  const command = ['pnpm', '--filter', '@stardust/crew', 'run', 'check:architecture']
  return [step('Architecture: apps/crew', command)]
}

function planStaticChecks(changes, workspaces, base) {
  const existing = changes.filter(({ deleted }) => !deleted).map(({ path }) => path)
  const changed = workspaces.filter(({ isChanged }) => isChanged)
  const withCode = workspaces.filter(({ code }) => code.length)
  // The integrity sensor applies after tests are added, changed, moved or removed.
  const touchesTests = changes.some(({ path }) => TEST_FILE.test(path))
  return [
    ...planLint(existing),
    ...(withCode.some(({ directory }) => WORKSPACES[directory].hasComplexity)
      ? [step('Complexity', ['node', 'scripts/check-complexity.mjs', '--base', base])]
      : []),
    ...planTypes(workspaces),
    ...planArchitecture(changed),
    ...(touchesTests
      ? [
          step('Test integrity', [
            'node',
            'scripts/check-test-integrity.mjs',
            '--base',
            base,
          ]),
        ]
      : []),
  ]
}

function planScriptTests(changes, requested, exists) {
  const tests = new Set(requested.map(({ file }) => file))
  const notes = []
  for (const { path, deleted } of changes) {
    const match = path.match(/^scripts\/(?:tests\/)?([^/]+?)(?:\.test)?\.mjs$/)
    if (!match) continue
    const test = `scripts/tests/${match[1]}.test.mjs`
    if (DATABASE_SCRIPT_TEST.test(path)) {
      notes.push(`${path} needs a local database. Run it yourself.`)
    } else if (exists(test)) tests.add(test)
    else if (!deleted && !requested.length) {
      notes.push(`No script test is named after ${path}. Add one with --tests.`)
    }
  }
  const steps = tests.size
    ? [step('Script tests', ['node', '--test', ...unique(tests)])]
    : []
  return { steps, notes }
}

// A test is named after its file and sits beside it or in the `tests` folder there.
function findNamedTests(directory, path, exists) {
  const folder = posix.dirname(path)
  const stem = posix.basename(path).replace(CODE_FILE, '')
  const name = stem === 'index' ? posix.basename(folder) : stem
  return [`${folder}/tests/${name}`, `${folder}/${name}`]
    .flatMap((candidate) => [`${candidate}.test.ts`, `${candidate}.test.tsx`])
    .filter((candidate) => exists(`${directory}/${candidate}`))
}

function selectTests({ directory, code }, { requested, exists }) {
  const workspace = WORKSPACES[directory]
  const existing = code
    .filter(({ path, deleted }) => !deleted && path.startsWith('src/'))
    .map(({ path }) => path)
  const asked = requested
    .filter((item) => item.directory === directory && item.file.startsWith('src/'))
    .map(({ file }) => file)
  const sources = existing.filter(
    (path) => !TEST_FILE.test(path) && !NO_BEHAVIOUR.test(path),
  )
  const direct = unique([
    ...existing.filter((path) => TEST_FILE.test(path)),
    ...sources.flatMap((path) => findNamedTests(directory, path, exists)),
    ...asked,
  ]).filter((path) => !workspace.evals?.test(path))
  const apart = workspace.integration?.pattern ?? workspace.containerTests
  const { measured, excluded } = workspace.coverage ?? {}
  return {
    sources,
    asked,
    unit: direct.filter((path) => !apart?.test(path)),
    apart: direct.filter((path) => apart?.test(path)),
    // A report with only declarations has nothing the coverage gate can read.
    measured: measured
      ? sources.filter((path) => measured.test(path) && !excluded.test(path))
      : [],
  }
}

// Escapes the characters of route folders, such as `(home)` and `[slug]`, for a glob.
function escapeGlob(path) {
  return path.replace(/[()[\]{}*?!]/g, '\\$&')
}

function jestCommand(workspace, targets, measured, withIntegration) {
  const projects = withIntegration ? workspace.integration.projects : workspace.projects
  return [
    'pnpm',
    '--filter',
    workspace.name,
    'exec',
    'jest',
    ...(projects ? ['--selectProjects', ...projects] : []),
    '--runTestsByPath',
    ...targets,
    // Integration files share one database.
    ...(withIntegration ? ['--runInBand'] : []),
    ...(measured.length
      ? [
          '--coverage',
          '--coverageDirectory=coverage/changed',
          ...measured.map((path) => `--collectCoverageFrom=${escapeGlob(path)}`),
        ]
      : []),
  ]
}

function testCommand(workspace, targets, measured, withIntegration) {
  if (workspace.runner === 'jest') {
    return jestCommand(workspace, targets, measured, withIntegration)
  }
  const runner =
    workspace.runner === 'vitest'
      ? ['vitest', 'run', '--project', 'unit']
      : ['node', '--import', 'tsx', '--test']
  return ['pnpm', '--filter', workspace.name, 'exec', ...runner, ...targets]
}

// The test files to run: those tied to the change plus the ones that import it.
function resolveTargets(directory, selection, context) {
  const { sources, asked, unit } = selection
  const canRelate = WORKSPACES[directory].runner !== 'node'
  const related =
    canRelate && sources.length ? context.listRelated(directory, sources) : []
  const isOverLimit = related.length > RELATED_TESTS_LIMIT
  const targets = unique(isOverLimit ? unit : [...unit, ...related])
  if (!isOverLimit) return { targets, skips: [], notes: [], isPartial: false }
  const excess = `${related.length} test files import the changed files in ${directory}, more than ${RELATED_TESTS_LIMIT}`
  // Naming tests is the way to accept a selection narrower than the related one.
  if (asked.length) {
    const note = `${excess}. Only the changed, named and requested tests run.`
    return { targets, skips: [], notes: [note], isPartial: false }
  }
  const skips = [
    skipped(
      `Related tests: ${directory}`,
      `${excess}; add the relevant ones with --tests`,
    ),
  ]
  return { targets, skips, notes: [], isPartial: true }
}

function planIntegration(directory, files, context) {
  if (!files.length) return { files: [], skips: [] }
  let reason
  if (!context.integration) {
    reason =
      'they clear the local database; prepare it with db:test and pass --integration'
  } else if (!context.isDockerRunning) reason = 'Docker is not running'
  if (!reason) return { files, skips: [] }
  return { files: [], skips: [skipped(`Integration tests: ${directory}`, reason)] }
}

function planContainerTests(directory, files, context) {
  if (!files.length) return []
  const label = `Integration tests: ${directory}`
  if (!context.isDockerRunning) return [skipped(label, 'Docker is not running')]
  const command = ['pnpm', '--filter', WORKSPACES[directory].name, 'exec']
  return [
    step(label, [...command, 'vitest', 'run', '--project', 'integration', ...files]),
  ]
}

// Runs only the tests tied to the change, then measures only the changed lines.
function planWorkspaceTests(description, context) {
  const { directory } = description
  const workspace = WORKSPACES[directory]
  if (!workspace.runner) return { steps: [], notes: [] }
  const selection = selectTests(description, context)
  const { targets, skips, notes, isPartial } = resolveTargets(
    directory,
    selection,
    context,
  )
  const integration = workspace.integration
    ? planIntegration(directory, selection.apart, context)
    : { files: [], skips: [] }
  const all = unique([...targets, ...integration.files])
  const incomplete = [...skips, ...integration.skips]
  const tests = `Tests: ${directory}`
  const steps = [...incomplete]
  if (all.length) {
    const withIntegration = integration.files.length > 0
    const command = testCommand(workspace, all, selection.measured, withIntegration)
    const env = withIntegration ? { env: workspace.integration.env } : {}
    steps.push(step(tests, command, env))
  } else if (selection.sources.length && !incomplete.length && !selection.apart.length) {
    const how = workspace.runner === 'node' ? 'is named after' : 'imports'
    steps.push(skipped(tests, `no test ${how} the changed files; use --tests`))
  }
  if (all.length && selection.measured.length) {
    const command = [
      'node',
      'scripts/check-changed-coverage.mjs',
      workspace.coverage.gate,
      `${directory}/coverage/changed/lcov.info`,
      '--base',
      context.base,
      '--working-tree',
    ]
    const label = `Changed-lines coverage: ${directory}`
    steps.push(
      isPartial || integration.skips.length
        ? skipped(label, 'the test selection is incomplete')
        : step(label, command, { requires: tests }),
    )
  }
  if (workspace.containerTests) {
    steps.push(...planContainerTests(directory, selection.apart, context))
  }
  return { steps, notes }
}

function planBrowserTests(changes, requested, exists) {
  const { browserTests } = WORKSPACES['apps/web']
  const prefix = 'apps/web/'
  const changed = changes
    .filter(({ path, deleted }) => !deleted && path.startsWith(prefix))
    .map(({ path }) => path.slice(prefix.length))
  const asked = requested
    .filter(({ directory }) => directory === 'apps/web')
    .map(({ file }) => file)
  const files = unique([...changed, ...asked]).filter(
    (file) => browserTests.test(file) && exists(`${prefix}${file}`),
  )
  // Without file arguments Playwright would run the complete suite, so no step exists.
  if (!files.length) return []
  const command = ['pnpm', '--filter', '@stardust/web', 'run', 'test:integration']
  return [step('Playwright: apps/web', [...command, ...files])]
}

// The LSP package is consumed through its build output in the apps' tests.
function addPackageBuild(steps, workspaces, exists) {
  const label = 'Build: packages/lsp'
  const consumers = new RegExp(`^(?:Tests|Playwright): (?:${APPS.join('|')})$`)
  const dependents = steps.filter(
    ({ label: name, skip }) => !skip && consumers.test(name),
  )
  const isStale =
    !exists('packages/lsp/build/main.js') ||
    workspaces.some(
      ({ directory, changesContract }) => directory === 'packages/lsp' && changesContract,
    )
  if (!dependents.length || !isStale) return steps
  const build = step(label, ['pnpm', '--filter', '@stardust/lsp', 'run', 'build'])
  const first = steps.indexOf(dependents[0])
  return [
    ...steps.slice(0, first),
    build,
    ...steps
      .slice(first)
      .map((item) => (dependents.includes(item) ? { ...item, requires: label } : item)),
  ]
}

function planMutation(changes, useCases) {
  const sources = changes
    .map(({ path }) => path)
    .filter((path) => path.startsWith('packages/core/src/'))
  const files = selectChangedFiles(useCases, sources)
  if (!files.length) return []
  const command = ['pnpm', '--filter', '@stardust/core', 'run', 'test:mutation']
  return [
    step('Mutation: changed use cases', [...command, '--files', ...files], {
      // Finishing the run says nothing about the score: the gate compares two sides.
      review: 'compare the file scores with "Gate de mutação" in tooling.md',
    }),
  ]
}

function planNotes(changes, workspaces, steps) {
  const notes = []
  const paths = changes.map(({ path }) => path)
  const existing = changes.filter(({ deleted }) => !deleted).map(({ path }) => path)
  const behaviour = existing.filter(
    (path) => !TEST_FILE.test(path) && !TEST_SUPPORT.test(path) && CODE_FILE.test(path),
  )
  const shared = paths.filter((path) => SHARED_FILE.test(path))
  if (shared.length) {
    notes.push(
      `Shared files changed (${shared.join(', ')}). Run a broader check yourself if the change needs it.`,
    )
  }
  for (const { directory, code, changesContract } of workspaces) {
    const { runner, dependents } = WORKSPACES[directory]
    if (!runner && code.length) notes.push(`${directory} has no tests of its own.`)
    if (dependents && changesContract) {
      notes.push(
        `${directory} changed: the tests of its consumers are not selected. Add the affected ones with --tests.`,
      )
    }
  }
  const ranIntegration = steps.some(
    ({ label, env }) => label === 'Tests: apps/server' && env,
  )
  if (!ranIntegration && behaviour.some((path) => SERVER_BOUNDARY.test(path))) {
    notes.push(
      'Server boundaries changed: pass the affected route or Inngest tests with --tests and --integration. The CI coverage gate counts them.',
    )
  }
  if (behaviour.some((path) => FRONTEND.test(path))) {
    notes.push(
      'Frontend changed: pass the affected Playwright files with --tests and do the manual browser check of AGENTS.md.',
    )
  }
  if (paths.some((path) => /^apps\/crew\/src\/mastra\/agents\//.test(path))) {
    notes.push('Crew agents changed: evals call paid services, so run them yourself.')
  }
  return notes
}

function readRequestedTests(tests) {
  return tests.map((path) => {
    if (SCRIPT_TEST.test(path)) return { directory: 'scripts', file: path }
    const directory = Object.keys(WORKSPACES).find(
      (candidate) => WORKSPACES[candidate].runner && path.startsWith(`${candidate}/`),
    )
    const file = directory && path.slice(directory.length + 1)
    const isRunnable =
      file &&
      TEST_FILE.test(file) &&
      !WORKSPACES[directory].evals?.test(file) &&
      (file.startsWith('src/') || WORKSPACES[directory].browserTests?.test(file))
    if (!isRunnable) throw new Error(`Not a test file this command runs: ${path}`)
    return { directory, file }
  })
}

export function planChecks(changes, options) {
  const { base, exists, useCases = [], tests = [] } = options
  const requested = readRequestedTests(tests)
  const workspaces = Object.keys(WORKSPACES).map((directory) =>
    describeWorkspace(directory, changes),
  )
  const context = { ...options, base, requested }
  const scripts = planScriptTests(
    changes,
    requested.filter(({ directory }) => directory === 'scripts'),
    exists,
  )
  const testPlans = workspaces.map((workspace) => planWorkspaceTests(workspace, context))
  const tested = [
    ...testPlans.flatMap(({ steps }) => steps),
    ...planBrowserTests(changes, requested, exists),
  ]
  const steps = [
    ...planStaticChecks(changes, workspaces, base),
    ...scripts.steps,
    ...addPackageBuild(tested, workspaces, exists),
    // Mutation testing is the slowest check, so it runs last.
    ...planMutation(changes, useCases),
  ]
  return {
    steps,
    notes: [
      ...scripts.notes,
      ...testPlans.flatMap(({ notes }) => notes),
      ...planNotes(changes, workspaces, steps),
    ],
  }
}

export function executeSteps(steps, run) {
  const results = new Map()
  for (const item of steps) {
    const { label, skip, requires, review } = item
    const blocked =
      requires && results.get(requires)?.status !== 'PASS'
        ? `${requires} did not pass`
        : undefined
    const reason = skip ?? blocked
    if (reason) results.set(label, { status: 'SKIPPED', reason })
    else if (!run(item)) results.set(label, { status: 'FAIL' })
    else if (review) results.set(label, { status: 'REVIEW', reason: review })
    else results.set(label, { status: 'PASS' })
  }
  return results
}

// A skipped check is not a pass: 1 means a failure, 2 an incomplete run.
export function exitCodeFor(results) {
  const statuses = [...results.values()].map(({ status }) => status)
  if (statuses.includes('FAIL')) return 1
  return statuses.includes('SKIPPED') ? 2 : 0
}

export function parseArguments(argumentsList) {
  const options = { base: 'origin/main', dryRun: false, integration: false, tests: [] }
  const queue = argumentsList.filter((argument) => argument !== '--')
  while (queue.length) {
    const flag = queue.shift()
    if (flag === '--dry-run') options.dryRun = true
    else if (flag === '--integration') options.integration = true
    else if (flag === '--base' && queue[0]) options.base = queue.shift()
    else if (flag === '--tests' && queue[0] && !queue[0].startsWith('--')) {
      while (queue[0] && !queue[0].startsWith('--')) options.tests.push(queue.shift())
    } else throw new Error(USAGE)
  }
  return options
}

function git(...argumentsList) {
  return execFileSync('git', ['-c', 'core.quotePath=false', ...argumentsList], {
    cwd: ROOT_DIRECTORY,
    encoding: 'utf8',
    maxBuffer: 256 * 1024 * 1024,
  })
}

// Committed, staged, unstaged and untracked changes all count.
function listChanges(base) {
  const fields = git('diff', '--name-status', '--no-renames', '-z', base, '--')
    .split('\0')
    .filter(Boolean)
  const changes = []
  for (let index = 0; index < fields.length; index += 2) {
    changes.push({ path: fields[index + 1], deleted: fields[index] === 'D' })
  }
  const untracked = git('ls-files', '--others', '--exclude-standard', '-z')
    .split('\0')
    .filter(Boolean)
  return [...changes, ...untracked.map((path) => ({ path, deleted: false }))]
}

// Reads the JSON list that Jest and Vitest print, after any line written before it.
export function parseRelatedFiles(output, cwd) {
  const failure = `The test runner printed no readable list of test files in ${cwd}`
  const start = output.search(/^\[/m)
  if (start < 0) throw new Error(failure)
  let files
  try {
    files = JSON.parse(output.slice(start))
  } catch (cause) {
    throw new Error(failure, { cause })
  }
  // Jest lists paths, and Vitest lists objects with a `file` path.
  return files.map((item) =>
    relative(cwd, item.file ?? item)
      .split(sep)
      .join('/'),
  )
}

// Asks the runner which test files import the changed sources, without running them.
function createRelatedLister(base) {
  return (directory, sources) => {
    const { runner, projects } = WORKSPACES[directory]
    const cwd = resolve(ROOT_DIRECTORY, directory)
    const command =
      runner === 'vitest'
        ? ['vitest', 'list', '--filesOnly', '--json', '--project', 'unit']
        : ['jest', ...(projects ? ['--selectProjects', ...projects] : [])]
    const selection =
      runner === 'vitest'
        ? ['--changed', base]
        : ['--listTests', '--json', '--findRelatedTests', ...sources]
    const output = execFileSync('pnpm', ['exec', ...command, ...selection], {
      cwd,
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    })
    return parseRelatedFiles(output, cwd)
  }
}

function isDockerRunning() {
  return spawnSync('docker', ['info'], { stdio: 'ignore' }).status === 0
}

function runCommand({ label, command: [command, ...argumentsList], env }) {
  console.log(`\n=== ${label} ===`)
  const result = spawnSync(command, argumentsList, {
    cwd: ROOT_DIRECTORY,
    stdio: 'inherit',
    env: { ...process.env, ...env },
  })
  return result.status === 0
}

function printPlan(steps) {
  for (const { label, command, skip } of steps) {
    console.log(`\n${label}\n  ${skip ? `would skip: ${skip}` : command.join(' ')}`)
  }
}

function printSummary(results) {
  console.log('\n=== Summary ===')
  for (const [label, { status, reason }] of results) {
    console.log(`${status.padEnd(7)}  ${label}${reason ? ` (${reason})` : ''}`)
  }
}

function main() {
  const options = parseArguments(process.argv.slice(2))
  const exists = (path) => existsSync(join(ROOT_DIRECTORY, path))
  const missing = options.tests.find((path) => !exists(path))
  if (missing) throw new Error(`Test file not found: ${missing}`)
  const base = git('merge-base', options.base, 'HEAD').trim()
  const changes = listChanges(base)
  const { steps, notes } = planChecks(changes, {
    base,
    exists,
    tests: options.tests,
    integration: options.integration,
    isDockerRunning: isDockerRunning(),
    listRelated: createRelatedLister(base),
    useCases: listUseCases(ROOT_DIRECTORY, join(ROOT_DIRECTORY, 'packages/core')),
  })
  console.log(
    `${changes.length} changed file(s) since ${base.slice(0, 8)}, ${steps.length} check(s).`,
  )
  if (options.dryRun) printPlan(steps)
  else if (steps.length) {
    const results = executeSteps(steps, runCommand)
    printSummary(results)
    process.exitCode = exitCodeFor(results)
  }
  for (const note of notes) console.log(`\nNote: ${note}`)
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    main()
  } catch (error) {
    console.error(`Changed-code checks: ${error.message}`)
    process.exitCode = 1
  }
}
