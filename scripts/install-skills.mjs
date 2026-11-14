#!/usr/bin/env node

// Restores the third-party skills pinned in skills-lock.json into .agents/skills/.
// The lock file is the only list: add or remove a skill with `pnpm dlx skills add`
// or `pnpm dlx skills remove`, which update it, instead of editing this script.
import { run } from './utils.mjs'

// The CLI version is pinned because its --frozen-lockfile mode recomputes each skill's
// content hash and fails when it differs from the `computedHash` in the lock.
run('pnpm', ['dlx', 'skills@1.8.1', 'install', '--frozen-lockfile'])
