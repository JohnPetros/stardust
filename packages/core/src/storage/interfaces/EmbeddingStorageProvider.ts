import type { List } from '#global/domain/structures/List'
import type { Id } from '#global/domain/structures/Id'
import type { Integer } from '#global/domain/structures/Integer'
import type { Embedding, EmbeddingNamespace } from '../domain/structures'

export interface EmbeddingsStorageProvider {
  store(
    embeddings: Embedding[],
    documentId: Id,
    namespace: EmbeddingNamespace,
  ): Promise<void>
  search(
    vector: List<number>,
    topK: Integer,
    namespace: EmbeddingNamespace,
  ): Promise<Embedding[]>
  delete(documentId: Id, namespace: EmbeddingNamespace): Promise<void>
}
