import { Index } from '@upstash/vector'

import type { Id, Integer, List } from '@stardust/core/global/structures'
import { Embedding, type EmbeddingNamespace } from '@stardust/core/storage/structures'
import type { EmbeddingsStorageProvider } from '@stardust/core/storage/interfaces'

type EmbeddingMetadata = {
  text: string
  documentId: string
}

export class UpstashEmbeddingsStorageProvider implements EmbeddingsStorageProvider {
  private readonly index: Index = Index.fromEnv()

  async store(embeddings: Embedding[], namespace: EmbeddingNamespace): Promise<void> {
    await this.index.upsert(
      embeddings.map((embedding) => ({
        id: embedding.id.value,
        vector: embedding.vector.items,
        metadata: {
          text: embedding.text.value,
          documentId: embedding.documentId.value,
        },
      })),
      { namespace: namespace.value },
    )
  }

  async search(
    vector: List<number>,
    topK: Integer,
    namespace: EmbeddingNamespace,
  ): Promise<Embedding[]> {
    const results = await this.index.query<EmbeddingMetadata>(
      {
        topK: topK.value,
        vector: vector.items,
        includeMetadata: true,
        includeVectors: false,
      },
      { namespace: namespace.value },
    )

    return results.map((result) =>
      Embedding.create({
        id: result.id.toString(),
        text: result.metadata?.text ?? '',
        documentId: result.metadata?.documentId ?? '',
        vector: [],
      }),
    )
  }

  async delete(documentId: Id, namespace: EmbeddingNamespace): Promise<void> {
    await this.index.delete(
      { filter: "documentId = '" + documentId.value + "'" }, 
      { namespace: namespace.value }
    )
  }
}
