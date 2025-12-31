import type { Text } from '#global/domain/structures/Text'
import type { Embedding } from '../domain/structures'

export interface EmbeddingsGeneratorProvider {
  generate(content: Text): Promise<Embedding[]>
}
