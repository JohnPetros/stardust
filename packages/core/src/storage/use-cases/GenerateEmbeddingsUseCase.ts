import type { UseCase } from '../../global/interfaces'
import type {
  EmbeddingsGeneratorProvider,
  EmbeddingsStorageProvider,
} from '../interfaces'
import { Text } from '#global/domain/structures/Text'
import { Id } from '#global/domain/structures/Id'
import { EmbeddingNamespace } from '#storage/domain/structures/EmbeddingNamespace'

type Request = {
  namespace: string
  documentId: string
  content: string
}

export class GenerateEmbeddingsUseCase implements UseCase<Request> {
  constructor(
    private readonly generatorProvider: EmbeddingsGeneratorProvider,
    private readonly storageProvider: EmbeddingsStorageProvider,
  ) {}

  async execute(request: Request) {
    const content = Text.create(request.content)
    const documentId = Id.create(request.documentId)
    const embeddingNamespace = EmbeddingNamespace.create(request.namespace)
    const embeddings = await this.generatorProvider.generate(content, documentId)
    await this.storageProvider.delete(documentId, embeddingNamespace)
    await this.storageProvider.store(embeddings, embeddingNamespace)
  }
}
