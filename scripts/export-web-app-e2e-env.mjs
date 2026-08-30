#!/usr/bin/env node

import { existsSync, readFileSync } from 'node:fs'
import { output } from './utils.mjs'

const keys = ['WEB_APP_E2E_EMAIL', 'WEB_APP_E2E_PASSWORD']
function readEnvValue(content, key) {
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const separator = trimmed.indexOf('=')
    if (separator < 0 || trimmed.slice(0, separator).trim() !== key) continue
    const value = trimmed.slice(separator + 1).trim()
    if (!value) return null
    return value.replace(/^(['"])(.*)\1$/, '$2')
  }
  return null
}
function shellQuote(value) {
  return `'${value.replaceAll("'", "'\\''")}'`
}
const root = output('git', ['rev-parse', '--show-toplevel'])
const envFile = `${root}/.env.development`
if (!existsSync(envFile)) throw new Error(`arquivo ${envFile} não encontrado`)
const content = readFileSync(envFile, 'utf8')
for (const key of keys) {
  const value = readEnvValue(content, key)
  if (!value) throw new Error(`${key} não encontrado em ${envFile}`)
  console.log(`export ${key}=${shellQuote(value)}`)
}
console.error('Variáveis WEB_APP_E2E_* exportadas.')
