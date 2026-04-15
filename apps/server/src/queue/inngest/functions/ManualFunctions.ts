import type { SupabaseClient } from '@supabase/supabase-js'
import { GuidesEmbeddingsReindexRequestedEvent } from '@stardust/core/manual/events'

import { InngestFunctions } from './InngestFunctions'

import { ReindexGuidesEmbeddingsJob } from '@/queue/jobs/manual'
import { InngestAmqp } from '@/queue/inngest/InngestAmqp'
import { SupabaseGuidesRepository } from '@/database/supabase/repositories/manual'
import { MastraMarkdownEmbeddingsGeneratorProvider } from '@/provision/storage/MastraMarkdownEmbeddingsGeneratorProvider'
import { UpstashEmbeddingsStorageProvider } from '@/provision/storage/UpstashEmbeddingsStorageProvider'

export class ManualFunctions extends InngestFunctions {
  private createReindexGuidesEmbeddingsFunction(supabase: SupabaseClient) {
    return this.inngest.createFunction(
      {
        id: ReindexGuidesEmbeddingsJob.KEY,
        onFailure: (context) =>
          this.handleFailure(context, ReindexGuidesEmbeddingsJob.name),
      },
      { event: GuidesEmbeddingsReindexRequestedEvent._NAME },
      async (context) => {
        const repository = new SupabaseGuidesRepository(supabase)
        const generatorProvider = new MastraMarkdownEmbeddingsGeneratorProvider()
        const storageProvider = new UpstashEmbeddingsStorageProvider()
        const amqp = new InngestAmqp(context)

        const job = new ReindexGuidesEmbeddingsJob(
          repository,
          generatorProvider,
          storageProvider,
        )

        return await job.handle(amqp)
      },
    )
  }

  getFunctions(supabase: SupabaseClient) {
    return [this.createReindexGuidesEmbeddingsFunction(supabase)]
  }
}
