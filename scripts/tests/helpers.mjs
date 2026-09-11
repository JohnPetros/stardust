import assert from 'node:assert/strict'
import { execFile } from 'node:child_process'
import { access } from 'node:fs/promises'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

export const execFileAsync = promisify(execFile)
export const scriptsDirectory = fileURLToPath(new URL('..', import.meta.url))

export async function assertScriptSyntax(scriptName) {
  const scriptPath = fileURLToPath(new URL(`../${scriptName}`, import.meta.url))
  await access(scriptPath)
  await execFileAsync(process.execPath, ['--check', scriptPath])
}

export async function runScript(scriptName, argumentsList = [], options = {}) {
  const scriptPath = fileURLToPath(new URL(`../${scriptName}`, import.meta.url))
  return execFileAsync(process.execPath, [scriptPath, ...argumentsList], options)
}

export function assertUsageFailure(error, text) {
  assert.notEqual(error.code, 0)
  assert.match(`${error.stdout ?? ''}${error.stderr ?? ''}`, new RegExp(text))
}
