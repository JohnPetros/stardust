import type { Id } from '#global/domain/structures/Id'
import type { Star } from '../domain/entities'

export interface StarsRepository {
  findById(starId: Id): Promise<Star | null>
  addUnlocked(starId: Id, userId: Id): Promise<void>
}
