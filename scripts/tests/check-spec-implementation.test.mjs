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
const PLAN_PATH = 'documentation/features/example/path-check/plan.md'
const LEGACY_SPEC_PATH = 'documentation/features/example/path-check/legacy-spec.md'
const LEGACY_PLAN_PATH = 'documentation/features/example/path-check/legacy-plan.md'
const SPEC = `---
title: Path check
status: in_progress
revision: 1
---

# 1. Context and scope

# 2. Implementation Contract

- RF-01: the paths are delivered.
- CA-01: Given the Spec, When it is implemented, Then every path matches Git.

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
const PLAN_ROWS = [
  { change: 'Create', path: 'src/created.ts' },
  { change: 'Modify', path: 'src/modified.ts' },
  { change: 'Generate', path: 'src/generated.ts' },
  { change: 'Remove', path: 'src/removed.ts' },
]

function deriveTaskStatus(rows) {
  if (rows.every((row) => row.status === 'completed')) return 'completed'
  if (rows.every((row) => row.status === 'pending')) return 'pending'
  return 'in_progress'
}

function buildPlan({
  legacy = false,
  revision = 1,
  rows,
  status = 'in_progress',
  rowStatus = 'pending',
  tasks,
} = {}) {
  const resolvedRows = (
    rows ??
    PLAN_ROWS.map((row) => ({ ...row, requirements: 'RF-01, CA-01', status: rowStatus }))
  ).map((row) => ({ task: 'T1', ...row }))
  const planRows = resolvedRows
    .map((row) =>
      legacy
        ? `| \`${row.path}\` | ${row.change} | ${row.requirements} | ${row.status} | none |`
        : `| \`${row.path}\` | ${row.change} | ${row.task} | ${row.requirements} | ${row.status} | none |`,
    )
    .join('\n')
  const resolvedTasks = tasks ?? [
    {
      builder: 'Direct',
      dependsOn: 'none',
      id: 'T1',
      status: deriveTaskStatus(resolvedRows),
    },
  ]
  const tasksSection = legacy
    ? ''
    : `## Tasks

| Task | Outcome | Builder | Depends on | Status | Notes |
| --- | --- | --- | --- | --- | --- |
${resolvedTasks
  .map(
    (task) =>
      `| ${task.id} | outcome of ${task.id} | ${task.builder} | ${task.dependsOn} | ${task.status} | none |`,
  )
  .join('\n')}

`
  return `---
title: Path check — plan
spec: ./spec.md
spec_revision: ${revision}
evaluation: ./evaluation.md
status: ${status}
${legacy ? 'tasks: none\n' : ''}updated_at: 2026-11-14
---

# Plan — Path check

${tasksSection}## Progress

| Path | Change | ${legacy ? '' : 'Task | '}RF/CA | Status | Notes |
| --- | --- | ${legacy ? '' : '--- | '}--- | --- | --- |
${planRows}
`
}

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

async function deliverContractedPaths(repositoryRoot) {
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
}

async function runChecker(repositoryRoot, argumentsList, specPath = SPEC_PATH) {
  try {
    const { stdout } = await execFileAsync(
      process.execPath,
      [SCRIPT_PATH, specPath, ...argumentsList, '--json'],
      { cwd: repositoryRoot },
    )
    return JSON.parse(stdout)
  } catch (error) {
    if (!error.stdout) throw error
    return JSON.parse(error.stdout)
  }
}

test('passes when every contracted path has the expected Git state', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await deliverContractedPaths(repositoryRoot)
    const { stdout } = await execFileAsync(
      process.execPath,
      [SCRIPT_PATH, SPEC_PATH, '--json'],
      { cwd: repositoryRoot },
    )
    const result = JSON.parse(stdout)
    assert.equal(result.status, 'passed')
    assert.equal(result.pathsCount, 4)
    assert.deepEqual(result.errors, [])
    assert.equal(result.plan, null)
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

test('plan-only validates a pending plan without requiring delivered paths', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await writeFile(path.join(repositoryRoot, PLAN_PATH), buildPlan())
    const result = await runChecker(repositoryRoot, ['--plan-only'])
    assert.deepEqual(result.errors, [])
    assert.equal(result.status, 'passed')
    assert.equal(result.planOnly, true)
    assert.equal(result.baseSha, null)
    assert.equal(result.plan.rowsCount, 4)
    assert.deepEqual(result.plan.statusCounts, {
      completed: 0,
      in_progress: 0,
      pending: 4,
    })
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('requires the plan only when asked and passes a fully completed delivery', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await deliverContractedPaths(repositoryRoot)

    const withoutPlan = await runChecker(repositoryRoot, [])
    assert.equal(withoutPlan.status, 'passed')

    const requiredButMissing = await runChecker(repositoryRoot, ['--require-plan'])
    assert.equal(requiredButMissing.status, 'failed')
    assert.match(requiredButMissing.errors.join('\n'), /plan\.md: plan is required/)

    const planOnlyMissing = await runChecker(repositoryRoot, ['--plan-only'])
    assert.equal(planOnlyMissing.status, 'failed')
    assert.match(planOnlyMissing.errors.join('\n'), /plan\.md: plan is required/)

    await writeFile(
      path.join(repositoryRoot, PLAN_PATH),
      buildPlan({ rowStatus: 'completed', status: 'completed' }),
    )
    const complete = await runChecker(repositoryRoot, ['--require-plan'])
    assert.deepEqual(complete.errors, [])
    assert.equal(complete.status, 'passed')
    assert.equal(complete.plan.statusCounts.completed, 4)
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('rejects a plan that drifted from the Spec', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await writeFile(
      path.join(repositoryRoot, PLAN_PATH),
      buildPlan({
        revision: 2,
        rows: [
          {
            change: 'Create',
            path: 'src/created.ts',
            requirements: 'RF-01, CA-99',
            status: 'done',
          },
          {
            change: 'Create',
            path: 'src/modified.ts',
            requirements: 'RF-01',
            status: 'pending',
          },
          {
            change: 'Generate',
            path: 'src/generated.ts',
            requirements: 'none',
            status: 'pending',
          },
          {
            change: 'Modify',
            path: 'src/extra.ts',
            requirements: 'CA-01',
            status: 'pending',
          },
        ],
      }),
    )
    const result = await runChecker(repositoryRoot, ['--plan-only'])
    const messages = result.errors.join('\n')
    assert.equal(result.status, 'failed')
    assert.match(messages, /spec_revision "2" does not match the Spec revision "1"/)
    assert.match(messages, /src\/created\.ts: CA-99 does not exist in the Spec/)
    assert.match(
      messages,
      /src\/created\.ts: status must be pending, in_progress or completed/,
    )
    assert.match(
      messages,
      /src\/modified\.ts: Change Create differs from the Spec \(Modify\)/,
    )
    assert.match(messages, /src\/generated\.ts: RF\/CA must link at least one/)
    assert.match(messages, /src\/extra\.ts: row is not in the Spec path map/)
    assert.match(messages, /src\/removed\.ts: Spec path has no plan row/)
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('verifies completed rows against Git and requires every row to be completed', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    const rows = PLAN_ROWS.map((row, index) => ({
      ...row,
      requirements: 'RF-01, CA-01',
      status: index === 0 ? 'completed' : 'in_progress',
    }))
    await writeFile(path.join(repositoryRoot, PLAN_PATH), buildPlan({ rows }))

    const lenient = await runChecker(repositoryRoot, [])
    const lenientMessages = lenient.errors.filter((message) =>
      message.includes('plan.md'),
    )
    assert.deepEqual(lenientMessages, [
      `${PLAN_PATH}: src/created.ts: Create path is missing (row is marked completed)`,
    ])

    const strict = await runChecker(repositoryRoot, ['--require-plan'])
    const strictMessages = strict.errors.join('\n')
    assert.match(
      strictMessages,
      /src\/modified\.ts: status is in_progress but every row must be completed/,
    )
    assert.match(
      strictMessages,
      /src\/removed\.ts: status is in_progress but every row must be completed/,
    )
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('rejects a completed plan that still has unfinished rows', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await writeFile(
      path.join(repositoryRoot, PLAN_PATH),
      buildPlan({ rowStatus: 'pending', status: 'completed' }),
    )
    const result = await runChecker(repositoryRoot, ['--plan-only'])
    assert.equal(result.status, 'failed')
    assert.match(
      result.errors.join('\n'),
      /src\/created\.ts: status is pending but every row must be completed/,
    )
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('reads only the top-level revision of the Spec frontmatter', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    const specWithSources = SPEC.replace(
      'revision: 1\n---',
      'revision: 1\nsource:\n  - type: prd\n    ref: documentation/prds/example-prd.md\n    revision: last_updated_at 2026-06-17\n---',
    )
    assert.notEqual(specWithSources, SPEC)
    await writeFile(path.join(repositoryRoot, SPEC_PATH), specWithSources)
    await writeFile(path.join(repositoryRoot, PLAN_PATH), buildPlan())
    const result = await runChecker(repositoryRoot, ['--plan-only'])
    assert.deepEqual(result.errors, [])
    assert.equal(result.status, 'passed')
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('reports plan rows that do not have all required cells', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await writeFile(
      path.join(repositoryRoot, PLAN_PATH),
      `${buildPlan()}| \`src/broken.ts\` | Create |\n`,
    )
    const result = await runChecker(repositoryRoot, ['--plan-only'])
    assert.equal(result.status, 'failed')
    assert.deepEqual(result.errors, [
      `${PLAN_PATH}: src/broken.ts: row must have Path, Change, Task, RF/CA and Status cells`,
    ])
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('prints the plan flags in the usage for --help', async () => {
  const { stdout } = await execFileAsync(process.execPath, [SCRIPT_PATH, '--help'])
  assert.match(stdout, /--plan-only/)
  assert.match(stdout, /--require-plan/)
})

test('prints the plan summary and the plan-only mode in text output', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await writeFile(path.join(repositoryRoot, PLAN_PATH), buildPlan())
    const { stdout: planOnly } = await execFileAsync(
      process.execPath,
      [SCRIPT_PATH, SPEC_PATH, '--plan-only'],
      { cwd: repositoryRoot },
    )
    assert.match(
      planOnly,
      /Plan: .*plan\.md \(4 rows: pending 4, in_progress 0, completed 0\)/,
    )
    assert.match(planOnly, /Tasks: 1 \(pending 1, in_progress 0, completed 0\)/)
    assert.match(planOnly, /Mode: plan-only/)
    assert.doesNotMatch(planOnly, /Baseline:/)

    await rm(path.join(repositoryRoot, PLAN_PATH))
    await deliverContractedPaths(repositoryRoot)
    const { stdout: withoutPlan } = await execFileAsync(
      process.execPath,
      [SCRIPT_PATH, SPEC_PATH],
      { cwd: repositoryRoot },
    )
    assert.match(withoutPlan, /Plan: not present/)
    assert.match(withoutPlan, /Baseline: main/)
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

const EVALUATION_PATH = 'documentation/features/example/path-check/evaluation.md'

function buildEvaluation(planLine) {
  return `---\ntitle: Path check — evaluation\nspec: ./spec.md\n${planLine}\nstatus: in_progress\n---\n\n# Evaluation\n`
}

test('--require-plan honors an explicit plan: none opt-out and rejects a missing key', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await deliverContractedPaths(repositoryRoot)
    const evaluationFile = path.join(repositoryRoot, EVALUATION_PATH)

    await writeFile(evaluationFile, buildEvaluation('plan: none'))
    const optOut = await runChecker(repositoryRoot, ['--require-plan'])
    assert.deepEqual(optOut.errors, [])
    assert.equal(optOut.status, 'passed')
    assert.equal(optOut.planOptOut, true)
    const { stdout } = await execFileAsync(
      process.execPath,
      [SCRIPT_PATH, SPEC_PATH, '--require-plan'],
      { cwd: repositoryRoot },
    )
    assert.match(stdout, /Plan: opted out \(evaluation\.md declares plan: none\)/)

    await writeFile(evaluationFile, buildEvaluation('plan_note: none'))
    const missingKey = await runChecker(repositoryRoot, ['--require-plan'])
    const missingKeyMessages = missingKey.errors.join('\n')
    assert.equal(missingKey.status, 'failed')
    assert.match(
      missingKeyMessages,
      /evaluation\.md: frontmatter must declare plan: <path> or plan: none/,
    )
    assert.match(missingKeyMessages, /plan\.md: plan is required/)

    await writeFile(evaluationFile, buildEvaluation('plan: ./plan.md'))
    const declared = await runChecker(repositoryRoot, ['--require-plan'])
    assert.equal(declared.status, 'failed')
    assert.equal(declared.planOptOut, false)
    assert.match(declared.errors.join('\n'), /plan\.md: plan is required/)
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('--plan-only ignores the plan: none opt-out', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await writeFile(
      path.join(repositoryRoot, EVALUATION_PATH),
      buildEvaluation('plan: none'),
    )
    const result = await runChecker(repositoryRoot, ['--plan-only'])
    assert.equal(result.status, 'failed')
    assert.equal(result.planOptOut, false)
    assert.match(result.errors.join('\n'), /plan\.md: plan is required/)
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('pairs a legacy <name>-spec.md with <name>-plan.md', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    await writeFile(path.join(repositoryRoot, LEGACY_SPEC_PATH), SPEC)
    await writeFile(path.join(repositoryRoot, LEGACY_PLAN_PATH), buildPlan())
    const result = await runChecker(repositoryRoot, ['--plan-only'], LEGACY_SPEC_PATH)
    assert.deepEqual(result.errors, [])
    assert.equal(result.plan.path, LEGACY_PLAN_PATH)
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('validates the Tasks table and links every path row to one task', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    const rows = PLAN_ROWS.map((row, index) => ({
      ...row,
      requirements: 'RF-01, CA-01',
      status: index < 2 ? 'completed' : 'pending',
      task: index < 2 ? 'T1' : 'T2',
    }))
    await writeFile(
      path.join(repositoryRoot, PLAN_PATH),
      buildPlan({
        rows,
        tasks: [
          {
            builder: 'Builder Fix ACH-03',
            dependsOn: 'none',
            id: 'T1',
            status: 'completed',
          },
          { builder: 'unassigned', dependsOn: 'T1', id: 'T2', status: 'pending' },
        ],
      }),
    )
    const result = await runChecker(repositoryRoot, ['--plan-only'])
    assert.deepEqual(result.errors, [])
    assert.equal(result.plan.tasksCount, 2)
    assert.deepEqual(result.plan.taskStatusCounts, {
      completed: 1,
      in_progress: 0,
      pending: 1,
    })
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('rejects tasks that are malformed, unlinked or inconsistent with their rows', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    const rows = PLAN_ROWS.map((row, index) => ({
      ...row,
      requirements: 'RF-01, CA-01',
      status: ['in_progress', 'completed', 'pending', 'pending'][index],
      task: ['T1', 'T2', 'T3', 'T9'][index],
    }))
    await writeFile(
      path.join(repositoryRoot, PLAN_PATH),
      buildPlan({
        rows,
        tasks: [
          { builder: 'Direct', dependsOn: 'T3', id: 'T1', status: 'pending' },
          { builder: 'someone', dependsOn: 'T2', id: 'T2', status: 'in_progress' },
          { builder: 'unassigned', dependsOn: 'T1, T7', id: 'T3', status: 'done' },
          { builder: 'unassigned', dependsOn: 'none', id: 'T4', status: 'in_progress' },
          { builder: 'Direct', dependsOn: 'none', id: 'T4', status: 'pending' },
        ],
      }),
    )
    const result = await runChecker(repositoryRoot, ['--plan-only'])
    const messages = result.errors.join('\n')
    assert.equal(result.status, 'failed')
    assert.match(messages, /T1: task is pending but some rows have started/)
    assert.match(
      messages,
      /T2: Builder must be Direct, unassigned, builder_<owner> or Builder Fix ACH-<n>/,
    )
    assert.match(messages, /T2: depends on itself/)
    assert.match(messages, /T2: every row is completed but the task is in_progress/)
    assert.match(messages, /T3: status must be pending, in_progress or completed/)
    assert.match(messages, /T3: depends on unknown task T7/)
    assert.match(messages, /T4: task is in_progress but has no assigned Builder/)
    assert.match(messages, /T4: task appears more than once/)
    assert.match(messages, /T4: task has no path rows/)
    assert.match(messages, /task dependencies form a cycle: T1 -> T3 -> T1/)
    assert.match(messages, /src\/removed\.ts: Task "T9" is not declared in Tasks/)
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})

test('requires a Tasks table unless the plan declares tasks: none', async () => {
  const repositoryRoot = await createRepositoryFixture()
  try {
    const withoutTasks = buildPlan({ tasks: [] })
    await writeFile(path.join(repositoryRoot, PLAN_PATH), withoutTasks)
    const missing = await runChecker(repositoryRoot, ['--plan-only'])
    assert.equal(missing.status, 'failed')
    assert.match(missing.errors.join('\n'), /plan has no tasks/)

    await writeFile(path.join(repositoryRoot, PLAN_PATH), buildPlan({ legacy: true }))
    const legacy = await runChecker(repositoryRoot, ['--plan-only'])
    assert.deepEqual(legacy.errors, [])
    assert.equal(legacy.plan.tasksCount, null)
    const { stdout } = await execFileAsync(
      process.execPath,
      [SCRIPT_PATH, SPEC_PATH, '--plan-only'],
      { cwd: repositoryRoot },
    )
    assert.match(stdout, /Tasks: none \(plan predates tasks\)/)

    await writeFile(
      path.join(repositoryRoot, PLAN_PATH),
      buildPlan({ legacy: true }).replace('tasks: none', 'tasks: T1'),
    )
    const invalid = await runChecker(repositoryRoot, ['--plan-only'])
    assert.match(invalid.errors.join('\n'), /tasks must be absent or none \(found "T1"\)/)
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})
