import type { EmbeddingDto } from './dtos'
import { List } from '#global/domain/structures/List'
import { Text } from '#global/domain/structures/Text'
import { Id } from '#global/domain/structures/Id'

export class Embedding {
  private constructor(
    readonly id: Id,
    readonly text: Text,
    readonly vector: List<number>,
  ) {}

  static create(dto: EmbeddingDto): Embedding {
    return new Embedding(
      Id.create(dto.id),
      Text.create(dto.text),
      List.create(dto.vector),
    )
  }
}
