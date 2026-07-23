import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { ReadinessCheckCommand } from './ReadinessCheckCommand'

function createFixture(): {
  rootDir: string
  specPath: string
  planPath: string
  revision: string
} {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'readiness-check-'))
  const specPath = 'feature-spec.md'
  const planPath = 'feature-plan.md'
  const spec = `---
title: Feature
status: open
---
# Spec
`
  fs.writeFileSync(path.join(rootDir, specPath), spec)
  const revision = new ReadinessCheckCommand().gitBlobHash(spec)
  fs.writeFileSync(
    path.join(rootDir, planPath),
    `---
spec: ${specPath}
spec_revision: ${revision}
---
# Plan
- [x] **T1 — Foundation**
  - **Estado:** accepted
  - **Depende de:** -
- [ ] **T2 — Feature**
  - **Estado:** pending
  - **Depende de:** T1
`,
  )
  return { rootDir, specPath, planPath, revision }
}

test('accepts an open Spec and a task whose dependencies are accepted', () => {
  const fixture = createFixture()

  const result = new ReadinessCheckCommand().execute({
    ...fixture,
    taskId: 'T2',
  })

  assert.equal(result.passed, true)
  assert.deepEqual(result.details.dependencies, ['T1'])
})

test('reports revision drift and pending dependencies', () => {
  const fixture = createFixture()
  const plan = fs
    .readFileSync(path.join(fixture.rootDir, fixture.planPath), 'utf8')
    .replace('[x] **T1', '[ ] **T1')
    .replace('**Estado:** accepted', '**Estado:** pending')
  fs.writeFileSync(path.join(fixture.rootDir, fixture.planPath), plan)

  const result = new ReadinessCheckCommand().execute({
    ...fixture,
    revision: '0000000000000000000000000000000000000000',
    taskId: 'T2',
  })
  const codes = result.findings.map((finding) => finding.code)

  assert.ok(codes.includes('READINESS_SPEC_REVISION_MISMATCH'))
  assert.ok(codes.includes('READINESS_DEPENDENCY_NOT_ACCEPTED'))
})
