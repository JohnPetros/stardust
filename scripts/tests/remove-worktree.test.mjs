import test from 'node:test'
import { assertUsageFailure, runScript } from './helpers.mjs'

test('requires a worktree branch name', async () => {
  await runScript('remove-worktree.mjs').then(
    () => {
      throw new Error('expected remove-worktree to reject missing arguments')
    },
    (error) => assertUsageFailure(error, 'informe o nome da worktree/branch'),
  )
})
