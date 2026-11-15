import type { Slug } from '#global/domain/structures/Slug'
import type { Galaxy } from '../domain/entities'

export interface GalaxiesRepository {
  findAll(): Promise<Galaxy[]>
  findBySlug(slug: Slug): Promise<Galaxy | null>
  findFirst(): Promise<Galaxy | null>
}
