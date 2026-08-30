import { execFileSync, spawnSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'

export function run(command, args = [], options = {}) {
  const result = spawnSync(command, args, { stdio: 'inherit', ...options })
  if (result.error) throw result.error
  if (result.status !== 0)
    throw new Error(`${command} exited with status ${result.status ?? 'unknown'}`)
  return result
}

export function output(command, args = [], options = {}) {
  return execFileSync(command, args, {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
    ...options,
  }).trim()
}

export function fail(message) {
  console.error(`Erro: ${message}`)
  process.exit(1)
}

export function warn(message) {
  console.error(`Aviso: ${message}`)
}

export function log(message) {
  console.log(`==> ${message}`)
}

export function commandExists(command) {
  try {
    output(command, ['--version'])
    return true
  } catch {
    return false
  }
}

export function ensureDirectory(path) {
  mkdirSync(path, { recursive: true })
}
