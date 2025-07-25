import type { Id, Text } from '#global/domain/structures/index'

export interface StoriesRepository {
  findByStar(starId: Id): Promise<Text | null>
  update(story: Text, starId: Id): Promise<void>
}
