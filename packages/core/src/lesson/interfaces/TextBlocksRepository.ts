import type { Id, TextBlock } from '#global/domain/structures/index'

export interface TextBlocksRepository {
  findAllByStar(starId: Id): Promise<TextBlock[]>
}
