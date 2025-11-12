import type { Id, Slug } from '@stardust/core/global/structures'
import type { ChallengesRepository } from '@stardust/core/challenging/interfaces'
import { type Challenge, ChallengeCategory } from '@stardust/core/challenging/entities'
import type { ChallengesListParams } from '@stardust/core/challenging/types'
import { ChallengeVote } from '@stardust/core/challenging/structures'

import type { Json } from '../../types/Database'
import { SupabaseRepository } from '../SupabaseRepository'
import { SupabaseChallengeMapper } from '../../mappers/challenging'
import { SupabasePostgreError } from '../../errors'

export class SupabaseChallengesRepository
  extends SupabaseRepository
  implements ChallengesRepository
{
  async findVoteByChallengeAndUser(challengeId: Id, userId: Id): Promise<ChallengeVote> {
    const { data, error } = await this.supabase
      .from('users_challenge_votes')
      .select('vote')
      .match({ challenge_id: challengeId.value, user_id: userId.value })
      .single()

    if (error) {
      return ChallengeVote.create('none')
    }

    return ChallengeVote.create(data.vote)
  }
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

    console.log('id', data)

    const { data: challenge, error: challengeError } = await this.supabase
      .from('challenges_view')
      .select('*')
      .eq('slug', challengeSlug.value)
      .single()

    if (challengeError) {
      return null
    }

    console.log('categories', challenge.categories)

    return SupabaseChallengeMapper.toEntity(challenge)
  }

  async findByStar(starId: Id): Promise<Challenge | null> {
    const { data, error } = await this.supabase
      .from('challenges_view')
      .select('*')
      .eq('star_id', starId.value)
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

  async findAllCategories(): Promise<ChallengeCategory[]> {
    const { data, error } = await this.supabase
      .from('categories')
      .select('*, challenges:challenges_categories(id:challenge_id)')
      .order('name')

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const categories: ChallengeCategory[] = data.map((category) =>
      ChallengeCategory.create({
        id: category.id,
        name: category.name,
      }),
    )

    return categories
  }

  async add(challenge: Challenge): Promise<void> {
    const { error } = await this.supabase.from('challenges').insert({
      id: challenge.id.value,
      title: challenge.title.value,
      code: challenge.code,
      description: challenge.description.value,
      difficulty_level: challenge.difficulty.level,
      user_id: challenge.author.id.value,
      star_id: challenge.starId?.value,
      is_public: challenge.isPublic.value,
      slug: challenge.slug.value,
      test_cases: challenge.testCases.map((testCase) => testCase.dto) as Json,
    })

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const { error: categoriesError } = await this.supabase
      .from('challenges_categories')
      .insert(
        challenge.categories.map((category) => {
          return {
            challenge_id: challenge.id.value,
            category_id: category.id.value,
          }
        }),
      )

    if (categoriesError) {
      await this.supabase.from('challenges').delete().match({ id: challenge.id.value })
      throw new SupabasePostgreError(categoriesError)
    }
  }

  async replace(challenge: Challenge): Promise<void> {
    const { error } = await this.supabase
      .from('challenges')
      .update({
        title: challenge.title.value,
        code: challenge.code,
        description: challenge.description.value,
        difficulty_level: challenge.difficulty.level,
        user_id: challenge.author.id.value,
        star_id: challenge.starId?.value,
        is_public: challenge.isPublic.value,
        slug: challenge.slug.value,
        test_cases: challenge.testCases.map((testCase) => testCase.dto) as Json,
      })
      .eq('id', challenge.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }

    const { error: deleteCategoriesError } = await this.supabase
      .from('challenges_categories')
      .delete()
      .eq('id', challenge.id.value)

    if (deleteCategoriesError) {
      throw new SupabasePostgreError(deleteCategoriesError)
    }

    const { error: insertCategoriesError } = await this.supabase
      .from('challenges_categories')
      .insert(
        challenge.categories.map((category) => ({
          challenge_id: challenge.id.value,
          category_id: category.id.value,
        })),
      )

    if (insertCategoriesError) {
      await this.supabase.from('challenges').delete().match({ id: challenge.id.value })
      throw new SupabasePostgreError(insertCategoriesError)
    }
  }

  async addVote(
    challengeId: Id,
    userId: Id,
    challengeVote: ChallengeVote,
  ): Promise<void> {
    const { error } = await this.supabase.from('users_challenge_votes').insert({
      challenge_id: challengeId.value,
      user_id: userId.value,
      vote: challengeVote.value === 'upvote' ? 'upvote' : 'downvote',
    })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async replaceVote(
    challengeId: Id,
    userId: Id,
    challengeVote: ChallengeVote,
  ): Promise<void> {
    const { error } = await this.supabase
      .from('users_challenge_votes')
      .update({
        vote: challengeVote.value === 'upvote' ? 'upvote' : 'downvote',
      })
      .match({ challenge_id: challengeId.value, user_id: userId.value })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async remove(challenge: Challenge): Promise<void> {
    const { error } = await this.supabase
      .from('challenges')
      .delete()
      .eq('id', challenge.id.value)

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }

  async removeVote(challengeId: Id, userId: Id): Promise<void> {
    const { error } = await this.supabase.from('users_challenge_votes').delete().match({
      challenge_id: challengeId.value,
      user_id: userId.value,
    })

    if (error) {
      throw new SupabasePostgreError(error)
    }
  }
}
