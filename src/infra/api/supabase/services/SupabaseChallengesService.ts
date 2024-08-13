import type { IChallengesService } from '@/@core/interfaces/services'
import { ServiceResponse } from '@/@core/responses'
import {
  ChallengeNotFoundError,
  FetchChallengesCategoriesUnexpectedError,
  FetchChallengesUnexpectedError,
} from '@/@core/errors/challenges'
import type { ChallengesListParams } from '@/@core/types/ChallengesListParams'
import type { ChallengeCategoryDTO } from '@/@core/dtos'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { SupabaseChallengeMapper } from '../mappers'

export const SupabaseChallengesService = (supabase: Supabase): IChallengesService => {
  const supabaseChallengeMapper = SupabaseChallengeMapper()

  return {
    async fetchChallengeBySlug(challengeSlug: string) {
      const { data, error } = await supabase
        .from('challenges_view')
        .select('*')
        .eq('slug', challengeSlug)
        .single()

      if (error) {
        return SupabasePostgrestError(error, ChallengeNotFoundError)
      }

      const challengeDTO = supabaseChallengeMapper.toDTO(data)

      return new ServiceResponse(challengeDTO)
    },

    async fetchChallengeSlugByStarId(starId) {
      const { data, error } = await supabase
        .from('challenges')
        .select('slug')
        .eq('star_id', starId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, ChallengeNotFoundError)
      }

      return new ServiceResponse(data.slug)
    },

    async fetchChallengesWithOnlyDifficulty() {
      const { data, error } = await supabase.from('challenges').select('id, difficulty')

      if (error) {
        return SupabasePostgrestError(error, ChallengeNotFoundError)
      }

      return new ServiceResponse(
        data.filter(({ id, difficulty }) => {
          return {
            id,
            difficulty: difficulty,
          }
        }),
      )
    },

    async fetchChallengesList({
      categoriesIds,
      difficulty,
      title,
    }: ChallengesListParams) {
      let query = supabase
        .from('challenges_view')
        .select('*, challenges_categories!inner(category_id)')

      if (title && title.length > 1) {
        query = query.ilike('title', `%${title}%`)
      }

      if (difficulty !== 'all') {
        query = query.eq('difficulty', difficulty)
      }

      if (categoriesIds.length) {
        query = query.in('challenges_categories.category_id', categoriesIds)
      }

      const { data, error } = await query

      if (error) {
        return SupabasePostgrestError(error, FetchChallengesUnexpectedError)
      }

      const challenges = data.map(supabaseChallengeMapper.toDTO)

      return new ServiceResponse(challenges)
    },

    async fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*, challenges:challenges_categories(id:challenge_id)')

      if (error) {
        return SupabasePostgrestError(error, FetchChallengesCategoriesUnexpectedError)
      }

      const categories: ChallengeCategoryDTO[] = data.map((category) => ({
        id: category.id,
        name: category.name,
        challengesIds: category.challenges.map(({ id }) => id),
      }))

      return new ServiceResponse(categories)
    },
  }
}
