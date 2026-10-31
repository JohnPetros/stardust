import { createStep, createWorkflow } from '@mastra/core/workflows'
import { z } from 'zod'

import type { App } from '@/app'

const purgeOutputSchema = z.object({ removed_runs_count: z.number() })

export class PurgeOldRunsWorkflow {
  constructor(private readonly app: App) {}

  create() {
    const purgeOldRuns = createStep({
      id: 'purge-old-runs',
      inputSchema: z.object({}),
      outputSchema: purgeOutputSchema,
      execute: async () => ({ removed_runs_count: await this.app.purgeOldRuns() }),
    })

    return createWorkflow({
      id: 'purge-old-runs',
      inputSchema: z.object({}),
      outputSchema: purgeOutputSchema,
      schedule: { cron: '0 3 * * *', timezone: 'America/Sao_Paulo' },
    })
      .then(purgeOldRuns)
      .commit()
  }
}
