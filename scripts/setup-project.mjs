#!/usr/bin/env node

import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import { run } from './utils.mjs'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
for (const script of [
  'install-skills.mjs',
  'sync-agents.mjs',
  'sync-commands.mjs',
  'sync-mcp-config.mjs',
]) {
  run(process.execPath, [resolve(root, 'scripts', script)], { cwd: root })
}
