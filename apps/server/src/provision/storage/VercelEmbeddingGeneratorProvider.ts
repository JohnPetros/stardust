import { google } from '@ai-sdk/google'
import { embedMany } from 'ai'

import type { Text } from '@stardust/core/global/structures'
import type { EmbeddingsGeneratorProvider } from '@stardust/core/storage/interfaces'
import { Embedding } from '@stardust/core/storage/structures'

export class VercelEmbeddingsGeneratorProvider implements EmbeddingsGeneratorProvider {
  async generate(content: Text): Promise<Embedding[]> {
    const result = await embedMany({
      model: google.textEmbedding('gemini-embedding-001'),
      values: [content.value],
      providerOptions: {
        google: {
          outputDimensionality: 1536,
        },
      },
    })
    return [
      Embedding.create({
        vector: result.embeddings[0],
        text: content.value,
      }),
    ]
  }
}
