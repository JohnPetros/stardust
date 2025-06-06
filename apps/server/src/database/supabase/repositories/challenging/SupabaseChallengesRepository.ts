import type { Id, Slug } from '@stardust/core/global/structures'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import type { Challenge } from '@stardust/core/challenging/entities'
import type { ChallengesListParams } from '@stardust/core/challenging/types'

import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseChallengeMapper } from '../../mappers/challenging'
import { SupabasePostgreError } from '../../errors'

export class SupabaseChallengesRepository
  extends SupabaseRepository
  implements ChallengesRepository
{
  async findById(challengeId: Id): Promise<Challenge | null> {
    const { data, error } = await this.supabase
      .from('challenges_view')
      .select('*')
      .eq('id', challengeId.value)
      .single()

    if (error) {
      return null
    }

    return SupabaseChallengeMapper.toEntity(data)
  }

  async findBySlug(challengeSlug: Slug): Promise<Challenge | null> {
    const { data, error } = await this.supabase
      .from('challenges_view')
      .select('*')
      .eq('slug', challengeSlug.value)
      .single()

    if (error) {
      return null
    }

    return SupabaseChallengeMapper.toEntity(data)
  }

  async findAllByNotAuthor(userId: Id) {
    const { data, error } = await this.supabase
      .from('challenges_view')
      .select('*')
      .neq('user_id', userId.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    return data.map(SupabaseChallengeMapper.toEntity)
  }

  async findMany({
    page,
    itemsPerPage,
    title,
    difficulty,
    upvotesCountOrder,
    postingOrder,
    userId,
    categoriesIds,
  }: ChallengesListParams): Promise<{
    challenges: Challenge[]
    totalChallengesCount: number
  }> {
    let query = this.supabase
      .from('challenges_view')
      .select('*, challenges_categories!inner(category_id)', { count: 'exact' })
      .is('star_id', null)

    if (title.isEmpty.isFalse) {
      query = query.ilike('title', `%${title.value}%`)
    }

    if (difficulty.isAny.isFalse) {
      query = query.eq('difficulty_level', difficulty.level)
    }

    if (postingOrder.isAny.isFalse) {
      query = query.order('created_at', { ascending: postingOrder.isAscending.isTrue })
    }

    if (upvotesCountOrder.isAny.isFalse) {
      query = query.order('upvotes_count', {
        ascending: upvotesCountOrder.isAscending.isTrue,
      })
    }

    if (upvotesCountOrder.isAny.isFalse) {
      query = query.order('upvotes_count', {
        ascending: upvotesCountOrder.isAscending.isTrue,
      })
    }

    console.log({ userId })

    if (userId) {
      query = query.eq('user_id', userId.value)
    }

    if (categoriesIds.isEmpty.isFalse) {
      query = query.in('challenges_categories.category_id', categoriesIds.dto)
    }

    const range = this.calculateQueryRange(page.value, itemsPerPage.value)

    const { data, count, error } = await query.range(range.from, range.to)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const challenges = data.map(SupabaseChallengeMapper.toEntity)
    return { challenges, totalChallengesCount: Number(count) }
  }
}
