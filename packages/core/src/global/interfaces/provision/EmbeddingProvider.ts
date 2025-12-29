import type { Text } from '#global/domain/structures/Text'
import type { Embedding } from '#global/domain/structures/Embedding'

export interface EmbeddingProvider {
  generate(content: Text): Promise<Embedding[]>
}
