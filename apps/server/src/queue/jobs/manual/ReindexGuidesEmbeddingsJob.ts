import type { Amqp, Job } from '@stardust/core/global/interfaces'
import type { Guide } from '@stardust/core/manual/entities'
import type { GuidesRepository } from '@stardust/core/manual/interfaces'
import type {
  EmbeddingsGeneratorProvider,
  EmbeddingsStorageProvider,
} from '@stardust/core/storage/interfaces'
import { EmbeddingNamespace } from '@stardust/core/storage/structures'
import { GenerateEmbeddingsUseCase } from '@stardust/core/storage/use-cases'

export class ReindexGuidesEmbeddingsJob implements Job {
  static readonly KEY = 'manual/reindex.guides.embeddings.job'

  constructor(
    private readonly guidesRepository: GuidesRepository,
    private readonly generatorProvider: EmbeddingsGeneratorProvider,
    private readonly storageProvider: EmbeddingsStorageProvider,
  ) {}

  async handle(amqp: Amqp): Promise<void> {
    const namespace = EmbeddingNamespace.create('guides')
    const guides = await amqp.run<Guide[]>(
      async () => await this.guidesRepository.findAll(),
      'Find all guides',
    )

    await amqp.run(
      async () => await this.storageProvider.clear(namespace),
      'Clear guides embeddings namespace',
    )

    const useCase = new GenerateEmbeddingsUseCase(
      this.generatorProvider,
      this.storageProvider,
    )

    for (const guide of guides) {
      await amqp.run(
        async () =>
          await useCase.execute({
            content: guide.content.value,
            documentId: guide.id.value,
            namespace: namespace.value,
          }),
        `Generate embeddings for guide ${guide.id.value}`,
      )
    }
  }
}
