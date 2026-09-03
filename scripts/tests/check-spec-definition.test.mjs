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
  new URL('../check-spec-definition.mjs', import.meta.url),
)

const validSpec = `---
title: Example
status: draft
revision: 1
source:
  - type: issue
scope:
  - packages/core
last_updated_at: 2026-09-03
---

# Context and scope
Context.
# Implementation Contract
Contract.
# Technical Contract
| Path | Change | Declaration | Contract | Dependencies | Tests |
| --- | --- | --- | --- | --- | --- |
| \`packages/core/src/value.ts\` | \`Modify\` | Value | behavior | none | unit |
# Validation Contract
| CA | RF | Dado | Quando | Então | Evidência esperada |
| CA-01 | RF-01 | input | call | output | unit |
# Documentation alignment and revision history
History.
`

test('accepts a canonical Spec definition', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'stardust-spec-definition-'))
  try {
    const specPath = path.join(directory, 'spec.md')
    await writeFile(specPath, validSpec)
    const { stdout } = await execFileAsync(process.execPath, [
      SCRIPT_PATH,
      specPath,
      '--json',
    ])
    const result = JSON.parse(stdout)
    assert.equal(result.status, 'passed')
    assert.deepEqual(result.errors, [])
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})

test('reports missing Spec definition sections and placeholders', async () => {
  const directory = await mkdtemp(path.join(tmpdir(), 'stardust-spec-definition-'))
  try {
    const specPath = path.join(directory, 'spec.md')
    await writeFile(specPath, '# Context and scope\nTODO\n')
    await assert.rejects(
      execFileAsync(process.execPath, [SCRIPT_PATH, specPath, '--json']),
      (error) => {
        const result = JSON.parse(error.stdout)
        assert.equal(result.status, 'failed')
        assert.match(result.errors.join('\n'), /missing YAML frontmatter/)
        assert.match(result.errors.join('\n'), /unresolved placeholder: TODO/)
        return true
      },
    )
  } finally {
    await rm(directory, { recursive: true, force: true })
  }
})
