import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type { EmbeddingsStorageProvider } from '@stardust/core/storage/interfaces'
import type { GuideDeletedEvent } from '@stardust/core/manual/events'
import { Id } from '@stardust/core/global/structures'
import { EmbeddingNamespace } from '@stardust/core/storage/structures'

type Payload = EventPayload<typeof GuideDeletedEvent>

export class DeleteGuideEmbeddingsJob implements Job {
  static readonly KEY = 'storage/delete.guide.embeddings'

  constructor(private readonly storageProvider: EmbeddingsStorageProvider) {}

  async handle(amqp: Amqp<Payload>): Promise<void> {
    const payload = amqp.getPayload()
    const guideId = Id.create(payload.guideId)
    const namespace = EmbeddingNamespace.create('guides')

    await amqp.run(
      async () => await this.storageProvider.delete(guideId, namespace),
      DeleteGuideEmbeddingsJob.name,
    )
  }
}
