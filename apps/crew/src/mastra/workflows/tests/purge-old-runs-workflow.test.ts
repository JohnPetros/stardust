import { Mastra } from '@mastra/core'
import { describe, expect, it, vi } from 'vitest'

import type { App } from '@/app'
import { PurgeOldRunsWorkflow } from '@/mastra/workflows/purge-old-runs-workflow'

function buildMastra(purgeOldRuns: () => Promise<number>) {
  const app = { purgeOldRuns } as unknown as App

  return new Mastra({
    workflows: { 'purge-old-runs': new PurgeOldRunsWorkflow(app).create() },
    logger: false,
  })
}

describe('PurgeOldRunsWorkflow', () => {
  it('purges old runs once and reports how many were removed', async () => {
    const purgeOldRuns = vi.fn().mockResolvedValue(3)
    const run = await buildMastra(purgeOldRuns).getWorkflow('purge-old-runs').createRun()

    const result = await run.start({ inputData: {} })

    expect(result.status).toBe('success')
    expect(result.status === 'success' && result.result).toEqual({
      removed_runs_count: 3,
    })
    expect(purgeOldRuns).toHaveBeenCalledTimes(1)
  })

  it('fails the run when purging fails', async () => {
    const purgeOldRuns = vi.fn().mockRejectedValue(new Error('database unavailable'))
    const run = await buildMastra(purgeOldRuns).getWorkflow('purge-old-runs').createRun()

    const result = await run.start({ inputData: {} })

    expect(result.status).toBe('failed')
    expect(purgeOldRuns).toHaveBeenCalledTimes(1)
  })
})
