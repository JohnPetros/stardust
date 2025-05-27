import type { Id } from '#global/domain/structures/Id'
import type { Slug } from '#global/domain/structures/Slug'
import type { Star } from '../domain/entities'

export interface StarsRepository {
  findById(starId: Id): Promise<Star | null>
  findBySlug(starSlug: Slug): Promise<Star | null>
}
