import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { EventPayload } from '@stardust/core/global/types'
import type {
  EmbeddingsGeneratorProvider,
  EmbeddingsStorageProvider,
} from '@stardust/core/storage/interfaces'
import { GenerateEmbeddingsUseCase } from '@stardust/core/storage/use-cases'
import type { GuideContentEditedEvent } from '@stardust/core/manual/events'

type Payload = EventPayload<typeof GuideContentEditedEvent>

export class GenerateGuideEmbeddingsJob implements Job {
  static readonly KEY = 'storage/generate.guide.embeddings'

  constructor(
    private readonly generatorProvider: EmbeddingsGeneratorProvider,
    private readonly storageProvider: EmbeddingsStorageProvider,
  ) {}

  async handle(amqp: Amqp<Payload>): Promise<void> {
    const payload = amqp.getPayload()
    const useCase = new GenerateEmbeddingsUseCase(
      this.generatorProvider,
      this.storageProvider,
    )
    await amqp.run(
      async () => await useCase.execute({
        content: payload.guideContent,
        documentId: payload.guideId,
        namespace: 'guides',
      }),
      GenerateEmbeddingsUseCase.name,
    )
  }
}
