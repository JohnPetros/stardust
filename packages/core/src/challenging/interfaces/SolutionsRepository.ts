import type { Id, Slug } from '#global/domain/structures/index'
import type { Solution } from '../domain/entities'
import type { SolutionsListingParams } from '../domain/types'

export interface SolutionsRepository {
  findById(solutionId: Id): Promise<Solution | null>
  findBySlug(solutionSlug: Slug): Promise<Solution | null>
  findMany(
    params: SolutionsListingParams,
  ): Promise<{ solutions: Solution[]; totalSolutionsCount: number }>
  add(solution: Solution, challengeId: Id): Promise<void>
  replace(solution: Solution): Promise<void>
  remove(solutionId: Id): Promise<void>
  addSolutionUpvote(solutionId: Id, userId: Id): Promise<void>
  removeSolutionUpvote(solutionId: Id, userId: Id): Promise<void>
}
