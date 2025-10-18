import type { Id, OrdinalNumber } from '#global/domain/structures/index'
import type { Slug } from '#global/domain/structures/Slug'
import type { Star } from '../domain/entities'

export interface StarsRepository {
  findById(starId: Id): Promise<Star | null>
  findBySlug(starSlug: Slug): Promise<Star | null>
  findByNumber(position: OrdinalNumber): Promise<Star | null>
  replace(star: Star): Promise<void>
}
