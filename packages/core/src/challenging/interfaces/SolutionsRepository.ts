import type { Id, Slug } from '#global/domain/structures/index'
import type { Solution } from '../domain/entities'
import type { SolutionsListingParams } from '../domain/types'

export interface SolutionsRepository {
  findById(solutionId: Id): Promise<Solution | null>
  findBySlug(solutionSlug: Slug): Promise<Solution | null>
  findMany(
    params: SolutionsListingParams,
  ): Promise<{ solutions: Solution[]; totalSolutionsCount: number }>
}
