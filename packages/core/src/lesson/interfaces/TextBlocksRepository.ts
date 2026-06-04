import type { Id, Integer } from '#global/domain/structures/index'
import type { TextBlock, TextBlockAudio } from '../domain/structures'

export interface TextBlocksRepository {
  findAllByStar(starId: Id): Promise<TextBlock[]>
  updateMany(textBlocks: TextBlock[], starId: Id): Promise<void>
  updateAudio(starId: Id, blockIndex: Integer, audio: TextBlockAudio): Promise<void>
  clearAudio(starId: Id, blockIndex: Integer): Promise<void>
}
