import type { List } from '#global/domain/structures/List'
import type { Id } from '#global/domain/structures/Id'
import { Integer } from '#global/domain/structures/Integer'
import { Embedding, EmbeddingNamespace } from '../structures'

export interface EmbeddingsStorageProvider {
  store(embeddings: Embedding[], namespace: EmbeddingNamespace): Promise<void>
  search(vector: List<number>, topK: Integer, namespace: EmbeddingNamespace): Promise<Embedding[]>
  delete(documentId: Id, namespace: EmbeddingNamespace): Promise<void>
}
