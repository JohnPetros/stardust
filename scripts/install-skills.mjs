#!/usr/bin/env node

// Restores the third-party skills pinned in skills-lock.json into .agents/skills/.
// The lock file is the only list: add or remove a skill with `pnpm dlx skills add`
// or `pnpm dlx skills remove`, which update it, instead of editing this script.
import { run } from './utils.mjs'

run('pnpm', ['dlx', 'skills', 'install', '--frozen-lockfile'])
