#!/usr/bin/env node

import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const packages = ['@stardust/core', '@stardust/validation']
function jsFiles(directory) {
  const files = []
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) files.push(...jsFiles(path))
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(path)
  }
  return files
}
function replaceImports(file) {
  const original = readFileSync(file, 'utf8')
  let content = original
  for (const packageName of packages) {
    const escaped = packageName.replace('/', '\\/')
    content = content
      .replace(
        new RegExp(`(require\\(["'])${escaped}\\/[^"']+(["']\\))`, 'g'),
        `$1${packageName}$2`,
      )
      .replace(
        new RegExp(`(from ["'])${escaped}\\/[^"']+(["'])`, 'g'),
        `$1${packageName}$2`,
      )
  }
  if (content !== original) writeFileSync(file, content)
}
console.log('🔍 Starting import replacements...')
for (const group of ['apps', 'packages']) {
  const groupPath = join(process.cwd(), group)
  if (!existsSync(groupPath)) continue
  for (const entry of readdirSync(groupPath, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const buildPath = join(groupPath, entry.name, 'build')
    if (!existsSync(buildPath)) continue
    console.log(`Processing ${group}/${entry.name} build directory...`)
    for (const file of jsFiles(buildPath)) {
      console.log(`Processing file: ${file}`)
      replaceImports(file)
    }
  }
}
console.log('✨ All import replacements completed!')
