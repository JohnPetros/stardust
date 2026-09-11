import assert from 'node:assert/strict'
import test from 'node:test'
import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { commandExists, ensureDirectory, log, output, run, warn } from '../utils.mjs'

test('utility output and commandExists execute successful commands', () => {
  assert.equal(output(process.execPath, ['-e', 'process.stdout.write("ok")']), 'ok')
  assert.equal(commandExists(process.execPath), true)
})

test('utility run propagates successful command results', () => {
  const result = run(process.execPath, ['-e', 'process.stdout.write("ok")'], {
    stdio: 'pipe',
  })
  assert.equal(result.status, 0)
})

test('ensureDirectory creates nested directories', async () => {
  const root = await mkdtemp(`${tmpdir()}/stardust-utils-`)
  try {
    const nested = join(root, 'one', 'two')
    ensureDirectory(nested)
    assert.equal(output('test', ['-d', nested]), '')
  } finally {
    await rm(root, { force: true, recursive: true })
  }
})

test('log and warn use the project message prefixes', () => {
  const originalLog = console.log
  const originalError = console.error
  const logs = []
  const errors = []
  console.log = (message) => logs.push(message)
  console.error = (message) => errors.push(message)
  try {
    log('message')
    warn('warning')
  } finally {
    console.log = originalLog
    console.error = originalError
  }
  assert.deepEqual(logs, ['==> message'])
  assert.deepEqual(errors, ['Aviso: warning'])
})
