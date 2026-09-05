import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const execFileAsync = promisify(execFile)
const SCRIPT_PATH = fileURLToPath(
  new URL('../check-plan-definition.mjs', import.meta.url),
)

const validPlan = `---
title: Example — implementation plan
status: pending
spec: ./spec.md
spec_revision: 1
evaluation: ./evaluation.md
updated_at: 2026-09-03
---

# Execution status
Pending.
# Execution ledger
| Wave | Builder | Phase | Name | Depends on | Parallel with | Status | Exit condition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| W1 | Builder F1 | F1 | Implement value | — | — | pending | tests pass |
# Validation and handoff
| Type | Scenario/surface | Criteria | Reference | Evidence target | Status |
| --- | --- | --- | --- | --- | --- |
| unit | value | passes | CA-01 | report | pending |
implementation-reviewer-agent is paired with Builder F1.
# Execution log
`

test('accepts a canonical Plan definition', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'stardust-plan-definition-'))
  try {
    const planPath = path.join(directory, 'plan.md')
    await writeFile(planPath, validPlan)
    await writeFile(
      path.join(directory, 'spec.md'),
      '---\nrevision: 1\n---\nRF-01 CA-01\n',
    )
    const { stdout } = await execFileAsync(process.execPath, [
      SCRIPT_PATH,
      planPath,
      '--json',
    ])
    const result = JSON.parse(stdout)
    assert.equal(result.status, 'passed')
    assert.deepEqual(result.errors, [])
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('reports invalid Plan dependencies and missing reviewers', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'stardust-plan-definition-'))
  try {
    const planPath = path.join(directory, 'plan.md')
    await writeFile(
      planPath,
      validPlan
        .replace('implementation-reviewer-agent is paired with Builder F1.', '')
        .replace('| — | — | pending |', '| Missing | — | pending |'),
    )
    await writeFile(
      path.join(directory, 'spec.md'),
      '---\nrevision: 1\n---\nRF-01 CA-01\n',
    )
    await assert.rejects(
      execFileAsync(process.execPath, [SCRIPT_PATH, planPath, '--json']),
      (error) => {
        const result = JSON.parse(error.stdout)
        assert.equal(result.status, 'failed')
        assert.match(result.errors.join('\n'), /paired Implementation Reviewer/)
        return true
      },
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('rejects a completed Plan with incomplete tasks', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'stardust-plan-definition-'))
  try {
    const planPath = path.join(directory, 'plan.md')
    await writeFile(planPath, validPlan.replace('status: pending', 'status: completed'))
    await writeFile(
      path.join(directory, 'spec.md'),
      '---\nrevision: 1\n---\nRF-01 CA-01\n',
    )
    await writeFile(
      path.join(directory, 'evaluation.md'),
      '---\nstatus: completed\n---\n',
    )
    await assert.rejects(
      execFileAsync(process.execPath, [SCRIPT_PATH, planPath, '--json']),
      (error) => {
        const result = JSON.parse(error.stdout)
        assert.equal(result.status, 'failed')
        assert.match(result.errors.join('\n'), /incomplete tasks/)
        return true
      },
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
