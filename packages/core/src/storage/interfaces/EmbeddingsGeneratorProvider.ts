import type { Text } from '#global/domain/structures/Text'
import type { Id } from '#global/domain/structures/Id'
import { Embedding } from '../domain/structures'

export interface EmbeddingsGeneratorProvider {
  generate(content: Text, documentId: Id): Promise<Embedding[]>
}
