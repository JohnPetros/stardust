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
if (process.argv.includes('--seed')) {
  const accounts = JSON.parse(readFileSync(new URL('../apps/server/src/database/seeders/data/seed-accounts.json', import.meta.url), 'utf8'))
  const account = accounts[0]
  console.log(`export ${keys[0]}=${shellQuote(account.email)}`)
  console.log(`export ${keys[1]}=${shellQuote(account.password)}`)
  process.exit(0)
}
const root = output('git', ['rev-parse', '--show-toplevel'])
const envFile = `${root}/.env.local`
if (!existsSync(envFile)) throw new Error(`arquivo ${envFile} não encontrado`)
const content = readFileSync(envFile, 'utf8')
for (const key of keys) {
  const value = readEnvValue(content, key)
  if (!value) throw new Error(`${key} não encontrado em ${envFile}`)
  console.log(`export ${key}=${shellQuote(value)}`)
}
console.error('Variáveis WEB_APP_E2E_* exportadas.')
