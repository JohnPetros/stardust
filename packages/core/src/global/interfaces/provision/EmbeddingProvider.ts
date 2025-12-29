import type { Text } from '#global/domain/structures/Text'
import { Embedding } from '#global/domain/structures/Embedding'

export interface EmbeddingProvider {
  generate(content: Text): Promise<Embedding[]>
}
