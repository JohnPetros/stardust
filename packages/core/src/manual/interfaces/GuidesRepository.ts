import type { Guide } from '../domain/entities'
import type { GuideCategory } from '../domain/structures'
import type { Id } from '#global/domain/structures/Id'
import type { Embedding } from '#global/domain/structures/Embedding'

export interface GuidesRepository {
  findById(id: Id): Promise<Guide | null>
  findAll(): Promise<Guide[]>
  findAllByCategory(category: GuideCategory): Promise<Guide[]>
  findLastByPositionAndCategory(category: GuideCategory): Promise<Guide | null>
  add(guide: Guide): Promise<void>
  addManyEmbeddings(guideId: Id, embeddings: Embedding[]): Promise<void>
  replace(guide: Guide): Promise<void>
  replaceMany(guides: Guide[]): Promise<void>
  remove(guide: Guide): Promise<void>
}
