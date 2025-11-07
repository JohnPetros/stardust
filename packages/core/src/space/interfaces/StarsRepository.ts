import type { Id, OrdinalNumber } from '#global/domain/structures/index'
import type { Slug } from '#global/domain/structures/Slug'
import type { Star } from '../domain/entities'

export interface StarsRepository {
  findAllOrdered(): Promise<Star[]>
  findById(starId: Id): Promise<Star | null>
  findBySlug(starSlug: Slug): Promise<Star | null>
  findByNumber(position: OrdinalNumber): Promise<Star | null>
  add(star: Star, planetId: Id): Promise<void>
  replace(star: Star): Promise<void>
  replaceMany(stars: Star[]): Promise<void>
  remove(starId: Id): Promise<void>
}
