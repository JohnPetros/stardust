import type { Id } from '#global/domain/structures/index'

export interface StoriesRepository {
  findByStar(starId: Id): Promise<string | null>
}
