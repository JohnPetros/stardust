import test from 'node:test'
import { assertUsageFailure, runScript } from './helpers.mjs'

test('requires a worktree branch name', async () => {
  await runScript('create-worktree.mjs').then(
    () => {
      throw new Error('expected create-worktree to reject missing arguments')
    },
    (error) => assertUsageFailure(error, 'informe o nome da worktree/branch'),
  )
})
