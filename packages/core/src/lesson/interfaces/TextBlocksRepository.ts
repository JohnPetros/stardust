import type { Id, TextBlock } from '#global/domain/structures/index'

export interface TextBlocksRepository {
  findAllByStar(starId: Id): Promise<TextBlock[]>
  updateMany(textBlocks: TextBlock[], starId: Id): Promise<void>
}
