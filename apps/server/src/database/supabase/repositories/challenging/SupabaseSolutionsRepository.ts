import type { Id, Slug } from '@stardust/core/global/structures'
import type { SolutionsRepository } from '@stardust/core/challenging/interfaces'
import type { Solution } from '@stardust/core/challenging/entities'
import type { SolutionsListingParams } from '@stardust/core/challenging/types'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseSolutionMapper } from '../../mappers/challenging'
import { SupabasePostgreError } from '../../errors'

export class SupabaseSolutionsRepository
  extends SupabaseRepository
  implements SolutionsRepository
{
  async findById(solutionId: Id): Promise<Solution | null> {
    const { data, error } = await this.supabase
      .from('solutions_view')
      .select('*')
      .eq('id', solutionId.value)
      .single()

    if (error) {
      return null
    }

    return SupabaseSolutionMapper.toEntity(data)
  }

  async findBySlug(solutionSlug: Slug): Promise<Solution | null> {
    const { data, error } = await this.supabase
      .from('solutions_view')
      .select('*')
      .eq('slug', solutionSlug.value)
      .single()

    if (error) {
      return null
    }

    return SupabaseSolutionMapper.toEntity(data)
  }

  async findAllByNotAuthor(userId: Id) {
    const { data, error } = await this.supabase
      .from('challenges_view')
      .select('*')
      .neq('user_id', userId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseSolutionMapper.toEntity)
  }

  async findMany({
    page,
    itemsPerPage,
    title,
    sorter,
    userId,
    challengeId,
  }: SolutionsListingParams): Promise<{
    solutions: Solution[]
    totalSolutionsCount: number
  }> {
    let query = this.supabase.from('solutions_view').select('*', { count: 'exact' })

    console.log({ page, itemsPerPage, title, sorter, userId, challengeId })

    if (challengeId) {
      query = query.eq('challenge_id', challengeId)
    }

    if (userId) {
      query = query.eq('author_id', userId)
    }

    if (title.isEmpty.isFalse) {
      query = query.ilike('title', `%${title}%`)
    }

    switch (sorter.value) {
      case 'date':
        query = query.order('created_at', {
          ascending: false,
        })
        break
      case 'upvotesCount':
        query = query.order('upvotes_count', {
          ascending: false,
        })
        break
      case 'commentsCount':
        query = query.order('comments_count', {
          ascending: false,
        })
        break
      case 'viewsCount':
        query = query.order('views_count', {
          ascending: false,
        })
        break
    }

    const range = this.calculateQueryRange(page.value, itemsPerPage.value)

    const { data, count, error } = await query.range(range.from, range.to)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const solutions = data.map(SupabaseSolutionMapper.toEntity)
    return { solutions, totalSolutionsCount: Number(count) }
  }
}
