import { MDocument } from '@mastra/rag'
import { google } from '@ai-sdk/google'
import { embedMany } from 'ai'

import { Embedding, type Text } from '@stardust/core/global/structures'
import type { EmbeddingProvider } from '@stardust/core/global/interfaces'

export class MastraMarkdownEmbeddingProvider implements EmbeddingProvider {
  async generate(content: Text): Promise<Embedding[]> {
    const documents = MDocument.fromMarkdown(content.value)
    const chunks = await documents.chunk({
      strategy: 'markdown',
      headers: [['##', 'title'],['###', 'section']],
      size: 1000, 
      overlap: 100
    })
    const result = await embedMany({
      model: google.embedding('gemini-embedding-001'),
      values: chunks.map((chunk) => chunk.text),
    })
    const embeddings = chunks.map((chunk, index) => Embedding.create(
      chunk.text,
      result.embeddings[index]
    ))
    return embeddings
  }
}
