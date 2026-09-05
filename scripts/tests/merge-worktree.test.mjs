import test from 'node:test'
import { assertUsageFailure, runScript } from './helpers.mjs'

test('requires a destination branch', async () => {
  await runScript('merge-worktree.mjs').then(
    () => {
      throw new Error('expected merge-worktree to reject missing arguments')
    },
    (error) => assertUsageFailure(error, 'informe a branch da worktree de destino'),
  )
})
