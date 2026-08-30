#!/usr/bin/env node

import { run } from './utils.mjs'

const skills = [
  'anthropics/skills@frontend-design',
  'github/awesome-copilot@gh-cli',
  'microsoft/playwright-cli',
  'chiroro-jr/pencil-design-skill@pencil-design',
  'vercel-labs/agent-skills@vercel-react-best-practices',
  'pproenca/dot-skills@zod',
]
for (const skill of skills) run('npx', ['skills', 'add', skill])
