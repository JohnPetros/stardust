import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { SupabaseChallengeMapper, SupabaseDocMapper } from '../mappers'
import { ApiResponse } from '@stardust/core/responses'
import { HTTP_STATUS_CODE } from '@stardust/core/constants'
import type { ChallengesListParams } from '@stardust/core/challenging/types'
import type { ChallengeCategoryDto } from '@stardust/core/challenging/dtos'
import type { IChallengingService } from '@stardust/core/interfaces'

export const SupabaseChallengingService = (supabase: Supabase): IChallengingService => {
  const supabaseChallengeMapper = SupabaseChallengeMapper()
  const supabaseDocMapper = SupabaseDocMapper()

  return {
    async fetchChallengeById(challengeId: string) {
      const { data, error } = await supabase
        .from('challenges_view')
        .select('*')
        .eq('id', challengeId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, 'Desafio não encontrado com esse id')
      }

      const challengeDto = supabaseChallengeMapper.toDto(data)

      return new ApiResponse({ body: challengeDto })
    },

    async fetchChallengeBySlug(challengeSlug: string) {
      const { data, error } = await supabase
        .from('challenges_view')
        .select('*')
        .eq('slug', challengeSlug)
        .single()

      if (error) {
        return SupabasePostgrestError(error, 'Desafio não encontrado com esse slug')
      }

      const challengeDto = supabaseChallengeMapper.toDto(data)

      return new ApiResponse({ body: challengeDto })
    },

    async fetchChallengeSlugByStarId(starId: string) {
      const { data, error } = await supabase
        .from('challenges')
        .select('slug')
        .eq('star_id', starId)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Slug de desafio não encontrado para essa estrela',
          HTTP_STATUS_CODE.notFound,
        )
      }

      return new ApiResponse({ body: data.slug })
    },

    async fetchChallengesWithOnlyDifficulty() {
      const { data, error } = await supabase.from('challenges').select('id, difficulty')

      if (error) {
        return SupabasePostgrestError(error, 'Erro ao buscar desafios')
      }

      return new ApiResponse({
        body: data.filter(({ id, difficulty }) => {
          return {
            id,
            difficulty: difficulty,
          }
        }),
      })
    },

    async fetchChallengesList({
      categoriesIds,
      difficultyLevel,
      title,
    }: ChallengesListParams) {
      let query = supabase
        .from('challenges_view')
        .select('*, challenges_categories!inner(category_id)')

      if (title && title.length > 1) {
        query = query.ilike('title', `%${title}%`)
      }

      if (difficultyLevel !== 'all') {
        query = query.eq('difficulty', difficultyLevel)
      }

      if (categoriesIds.length) {
        query = query.in('challenges_categories.category_id', categoriesIds)
      }

      const { data, error } = await query

      if (error) {
        return SupabasePostgrestError(error, 'Error inesperado ao filtrar desafios')
      }

      const challenges = data.map(supabaseChallengeMapper.toDto)

      return new ApiResponse({ body: challenges })
    },

    async fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*, challenges:challenges_categories(id:challenge_id)')

      if (error) {
        return SupabasePostgrestError(error, 'Error inesperado ao buscar desafios')
      }

      const categories: ChallengeCategoryDto[] = data.map((category) => ({
        id: category.id,
        name: category.name,
        challengesIds: category.challenges.map(({ id }) => id),
      }))

      return new ApiResponse({ body: categories })
    },

    async fetchChallengeVote(userId: string, challengeId: string) {
      const { data, error } = await supabase
        .from('users_challenge_votes')
        .select('vote')
        .match({ user_id: userId, challenge_id: challengeId })
        .single()

      if (error) {
        return new ApiResponse({ body: { challengeVote: null } })
      }

      return new ApiResponse({ body: { challengeVote: data.vote } })
    },

    async fetchDocs() {
      const { data, error } = await supabase
        .from('docs')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar dados do dicionário',
        )
      }

      const docs = data.map(supabaseDocMapper.toDto)

      return new ApiResponse({ body: docs })
    },

    async saveUnlockedDoc(docId: string, userId: string) {
      const { error } = await supabase
        .from('users_unlocked_docs')
        .insert({ doc_id: docId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao desbloquear dados do dicionário',
        )
      }

      return new ApiResponse()
    },

    async saveChallengeVote(challengeId, userId, challengeVote) {
      const { error } = await supabase.from('users_challenge_votes').insert({
        challenge_id: challengeId,
        user_id: userId,
        vote: challengeVote === 'upvote' ? 'upvote' : 'downvote',
      })

      if (error) {
        return SupabasePostgrestError(error, 'Error inesperado ao buscar desafios')
      }

      return new ApiResponse()
    },

    async updateChallengeVote(challengeId, userId, challengeVote) {
      const { error } = await supabase.from('users_challenge_votes').insert({
        challenge_id: challengeId,
        user_id: userId,
        vote: challengeVote === 'upvote' ? 'upvote' : 'downvote',
      })

      if (error) {
        return SupabasePostgrestError(error, 'Error inesperado ao buscar desafios')
      }

      return new ApiResponse()
    },

    async deleteChallengeVote(challengeId, userId) {
      const { error } = await supabase.from('users_challenge_votes').delete().match({
        challenge_id: challengeId,
        user_id: userId,
      })

      if (error) {
        return SupabasePostgrestError(error, 'Error inesperado ao buscar desafios')
      }

      return new ApiResponse()
    },
  }
}
