import { MDocument } from '@mastra/rag'
import { google } from '@ai-sdk/google'
import { embedMany } from 'ai'

import type { Id, Text } from '@stardust/core/global/structures'
import type { EmbeddingsGeneratorProvider } from '@stardust/core/storage/interfaces'
import { Embedding } from '@stardust/core/storage/structures'

export class MastraMarkdownEmbeddingsGeneratorProvider
  implements EmbeddingsGeneratorProvider
{
  async generate(content: Text, documentId: Id): Promise<Embedding[]> {
    const documents = MDocument.fromMarkdown(content.value)
    const chunks = await documents.chunk({
      strategy: 'markdown',
      headers: [
        ['##', 'title'],
        ['###', 'section'],
      ],
      maxSize: 1000,
      overlap: 100,
    })
    const result = await embedMany({
      model: google.textEmbedding('gemini-embedding-001'), 
      values: chunks.map((chunk) => chunk.text),
      providerOptions: {
        google: {
          outputDimensionality: 1536
        }
      }
    })
    const embeddings = chunks.map((chunk, index) =>
      Embedding.create(
        { 
          vector: result.embeddings[index],
          text: chunk.text,
          documentId: documentId.value,
        }, 
      ),
    )
    return embeddings
  }
}
