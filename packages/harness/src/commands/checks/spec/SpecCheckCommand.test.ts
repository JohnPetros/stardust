import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import { SpecCheckCommand } from './SpecCheckCommand'

function fixture(source: string): { rootDir: string; specPath: string } {
  const rootDir = fs.mkdtempSync(path.join(os.tmpdir(), 'spec-check-'))
  fs.mkdirSync(path.join(rootDir, 'apps/web'), { recursive: true })
  fs.writeFileSync(path.join(rootDir, 'apps/web/existing.ts'), '')
  const specPath = 'feature-spec.md'
  fs.writeFileSync(path.join(rootDir, specPath), source)
  return { rootDir, specPath }
}

test('accepts a traceable Spec with Contract and technical sections', () => {
  const input = fixture(`---
title: Feature
prd: https://example.test/prd
apps: web
status: draft
last_updated_at: 2026-07-23
---
# Spec
## Contract
| Requirement | Criterion | Result |
| --- | --- | --- |
| REQ-01 | AC-01 | Observable result |
| REQ-02 | AR-01 | Under 100 ms |
## Especificação Técnica
Modify \`apps/web/existing.ts\`.
Create \`apps/web/new.ts\` (novo arquivo).
`)

  const result = new SpecCheckCommand().execute(input)

  assert.equal(result.passed, true)
  assert.deepEqual(result.details.requirements, ['REQ-01', 'REQ-02'])
  assert.deepEqual(result.details.referencedPaths, [
    'apps/web/existing.ts',
    'apps/web/new.ts',
  ])
})

test('reports missing sections, traceability and repository paths', () => {
  const input = fixture(`---
title: Feature
prd: PRD
apps: web
status: draft
last_updated_at: 2026-07-23
---
# Spec
REQ-01
AC-01
Modify \`apps/web/missing.ts\`.
`)

  const result = new SpecCheckCommand().execute(input)
  const codes = result.findings.map((finding) => finding.code)

  assert.equal(result.passed, false)
  assert.ok(codes.includes('SPEC_CONTRACT_SECTION_MISSING'))
  assert.ok(codes.includes('SPEC_TECHNICAL_SECTION_MISSING'))
  assert.ok(codes.includes('SPEC_ID_OUTSIDE_CONTRACT'))
  assert.ok(codes.includes('SPEC_REQUIREMENTS_MISSING'))
  assert.ok(codes.includes('SPEC_CRITERIA_MISSING'))
  assert.ok(codes.includes('SPEC_REFERENCED_PATH_MISSING'))
})
