import type { Id } from '#global/domain/structures/index'
import type { Question } from '#lesson/domain/abstracts/Question'

export interface QuestionsRepository {
  findAllByStar(starId: Id): Promise<Question[]>
}
