import type { UseCase } from '#global/interfaces/UseCase'
import type {
  EmbeddingsGeneratorProvider,
  EmbeddingsStorageProvider,
} from '../interfaces'
import { Text } from '#global/domain/structures/Text'
import { Integer } from '#global/domain/structures/Integer'
import { EmbeddingNamespace } from '../domain/structures'

type Request = {
  query: string
  namespace: string
  topK: number
}

type Response = Promise<string[]>

export class SearchEmbeddingsUseCase implements UseCase<Request, Response> {
  constructor(
    private readonly generatorProvider: EmbeddingsGeneratorProvider,
    private readonly storageProvider: EmbeddingsStorageProvider,
  ) {}

  async execute({ query, namespace, topK }: Request) {
    const [embedding] = await this.generatorProvider.generate(Text.create(query))
    const results = await this.storageProvider.search(
      embedding.vector,
      Integer.create(topK),
      EmbeddingNamespace.create(namespace),
    )
    return results.map((result) => result.text.value)
  }
}
