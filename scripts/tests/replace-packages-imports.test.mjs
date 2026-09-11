import assert from 'node:assert/strict'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import test from 'node:test'
import { runScript } from './helpers.mjs'

test('runs safely when no build directories are present', async () => {
  const repositoryRoot = await mkdtemp(`${tmpdir()}/stardust-replace-imports-`)
  try {
    const { stdout } = await runScript('replace-packages-imports.mjs', [], {
      cwd: repositoryRoot,
    })
    assert.match(stdout, /Starting import replacements/)
    assert.match(stdout, /All import replacements completed/)
  } finally {
    await rm(repositoryRoot, { force: true, recursive: true })
  }
})
