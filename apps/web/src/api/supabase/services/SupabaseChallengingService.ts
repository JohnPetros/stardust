import { ApiResponse, PaginationResponse } from '@stardust/core/responses'
import type { ChallengesListParams } from '@stardust/core/challenging/types'
import type { ChallengeCategoryDto } from '@stardust/core/challenging/dtos'
import type { IChallengingService } from '@stardust/core/interfaces'

import type { Supabase } from '../types'
import { SupabasePostgrestError } from '../errors'
import {
  SupabaseChallengeMapper,
  SupabaseDocMapper,
  SupabaseSolutionMapper,
} from '../mappers'
import { calculateSupabaseRange } from '../utils'

export const SupabaseChallengingService = (supabase: Supabase): IChallengingService => {
  const supabaseChallengeMapper = SupabaseChallengeMapper()
  const supabaseDocMapper = SupabaseDocMapper()
  const supabaseSolutionMapper = SupabaseSolutionMapper()

  return {
    async fetchChallengeById(challengeId: string) {
      const { data, error, status } = await supabase
        .from('challenges_view')
        .select('*')
        .eq('id', challengeId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, 'Desafio não encontrado com esse id', status)
      }

      const challengeDto = supabaseChallengeMapper.toDto(data)

      return new ApiResponse({ body: challengeDto })
    },

    async fetchChallengeBySlug(challengeSlug: string) {
      const { data, error, status } = await supabase
        .from('challenges_view')
        .select('*')
        .eq('slug', challengeSlug)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Desafio não encontrado com esse slug',
          status,
        )
      }

      const challengeDto = supabaseChallengeMapper.toDto(data)

      return new ApiResponse({ body: challengeDto })
    },

    async fetchSolutionById(solutionId) {
      const { data, error, status } = await supabase
        .from('solutions_view')
        .select('*')
        .eq('id', solutionId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, 'Desafio não encontrado com esse id', status)
      }

      const challengeDto = supabaseSolutionMapper.toDto(data)

      return new ApiResponse({ body: challengeDto })
    },

    async fetchChallengeByStarId(starId: string) {
      const { data, error, status } = await supabase
        .from('challenges_view')
        .select('*')
        .eq('star_id', starId)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Slug de desafio não encontrado para essa estrela',
          status,
        )
      }

      return new ApiResponse({ body: supabaseChallengeMapper.toDto(data) })
    },

    async fetchChallengesWithOnlyDifficulty() {
      const { data, error, status } = await supabase
        .from('challenges')
        .select('id, difficulty')

      if (error) {
        return SupabasePostgrestError(error, 'Erro ao buscar desafios', status)
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
      page,
      itemsPerPage,
      categoriesIds,
      difficultyLevel,
      title,
    }: ChallengesListParams) {
      let query = supabase
        .from('challenges_view')
        .select('*, challenges_categories!inner(category_id)', { count: 'exact' })
        .is('star_id', null)

      if (title && title.length > 1) {
        query = query.ilike('title', `%${title}%`)
      }

      if (difficultyLevel !== 'all') {
        query = query.eq('difficulty', difficultyLevel)
      }

      if (categoriesIds.length) {
        query = query.in('challenges_categories.category_id', categoriesIds)
      }

      const range = calculateSupabaseRange(page, itemsPerPage)

      const { data, count, status, error } = await query.range(range.from, range.to)

      console.log({ error })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Error inesperado ao filtrar desafios',
          status,
        )
      }

      const challenges = data.map(supabaseChallengeMapper.toDto)

      return new ApiResponse({ body: new PaginationResponse(challenges, Number(count)) })
    },

    async fetchSolutionsList({ page, itemsPerPage, title, sorter, userId, challengeId }) {
      let query = supabase
        .from('solutions_view')
        .select('*', { count: 'exact' })
        .eq('challenge_id', challengeId)

      if (title && title.length > 1) {
        query = query.ilike('title', `%${title}%`)
      }

      if (userId) {
        query = query.eq('user_id', userId)
      }

      switch (sorter) {
        case 'date':
          query = query.order('created_at', {
            ascending: true,
          })
          break
        case 'upvotesCount':
          query = query.order('upvotes_count', {
            ascending: true,
          })
          break
        case 'commentsCount':
          query = query.order('comments_count', {
            ascending: true,
          })
          break
      }

      const range = calculateSupabaseRange(page, itemsPerPage)

      const { data, count, status, error } = await query.range(range.from, range.to)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Error inesperado ao filtrar a lista de soluções desse desafio',
          status,
        )
      }

      const solutions = data.map(supabaseSolutionMapper.toDto)

      return new ApiResponse({ body: new PaginationResponse(solutions, Number(count)) })
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

    async fetchChallengeVote(challengeId: string, userId: string) {
      const { data, error, status } = await supabase
        .from('users_challenge_votes')
        .select('vote')
        .match({ challenge_id: challengeId, user_id: userId })
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar voto do desafio desse usuário',
          status,
        )
      }

      return new ApiResponse({ body: { challengeVote: data.vote } })
    },

    async fetchSolutionBySlug(solutionSlug: string) {
      const { data, error, status } = await supabase
        .from('solutions_view')
        .select('*')
        .eq('slug', solutionSlug)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Desafio não encontrado com esse slug',
          status,
        )
      }

      const challengeDto = supabaseSolutionMapper.toDto(data)

      return new ApiResponse({ body: challengeDto })
    },

    async fetchDocs() {
      const { data, error, status } = await supabase
        .from('docs')
        .select('*')
        .order('position', { ascending: true })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar dados do dicionário',
        )
      }

      const docs = data.map(supabaseDocMapper.toDto, status)

      return new ApiResponse({ body: docs })
    },

    async saveSolution(solution, challengeId) {
      const supabaseSolution = supabaseSolutionMapper.toSupabase(solution)
      const { error, status } = await supabase.from('solutions').insert({
        // @ts-ignore
        id: solution.id,
        content: supabaseSolution.content,
        views_count: supabaseSolution.views_count,
        slug: supabaseSolution.slug,
        title: supabaseSolution.title,
        user_id: supabaseSolution.author_id,
        challenge_id: challengeId,
      })

      if (error) {
        return SupabasePostgrestError(error, 'Erro inesperado ao salvar solução', status)
      }

      return new ApiResponse()
    },

    async saveSolutionUpvote(solutionId, userId) {
      const { error, status } = await supabase.from('users_upvoted_solutions').insert({
        solution_id: solutionId,
        user_id: userId,
      })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao salvar upvote dessa solução',
          status,
        )
      }

      return new ApiResponse()
    },

    async saveCompletedChallenge(challengeId: string, userId: string) {
      const { error, status } = await supabase
        .from('users_completed_challenges')
        .insert({ challenge_id: challengeId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao salvar o desafio completado',
          status,
        )
      }

      return new ApiResponse()
    },

    async saveChallengeVote(challengeId, userId, challengeVote) {
      const { error, status } = await supabase.from('users_challenge_votes').insert({
        challenge_id: challengeId,
        user_id: userId,
        vote: challengeVote === 'upvote' ? 'upvote' : 'downvote',
      })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Error inesperado ao buscar desafios',
          status,
        )
      }

      return new ApiResponse()
    },

    async updateChallengeVote(challengeId, userId, challengeVote) {
      const { error, status } = await supabase
        .from('users_challenge_votes')
        .update({
          vote: challengeVote === 'upvote' ? 'upvote' : 'downvote',
        })
        .match({ challenge_id: challengeId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Error inesperado ao buscar desafios',
          status,
        )
      }

      return new ApiResponse()
    },

    async updateSolution(solution) {
      const solutionDto = solution.dto
      const { error, status } = await supabase
        .from('solutions')
        .update({
          content: solutionDto.content,
          views_count: solutionDto.viewsCount,
          slug: solutionDto.slug,
          title: solutionDto.title,
          user_id: solutionDto.author.id,
        })
        .eq('id', solution.id)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Error inesperado ao atualizar essa solução',
          status,
        )
      }

      return new ApiResponse()
    },

    async deleteChallengeVote(challengeId, userId) {
      const { error, status } = await supabase
        .from('users_challenge_votes')
        .delete()
        .match({
          challenge_id: challengeId,
          user_id: userId,
        })

      if (error) {
        return SupabasePostgrestError(error, 'Error inesperado ao remover voto', status)
      }

      return new ApiResponse()
    },

    async deleteSolution(solutionId) {
      const { error, status } = await supabase.from('solutions').delete().match({
        id: solutionId,
      })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Error inesperado ao deletar solução',
          status,
        )
      }

      return new ApiResponse()
    },

    async deleteSolutionUpvote(solutionId: string, userId: string) {
      const { error, status } = await supabase
        .from('users_upvoted_solutions')
        .delete()
        .match({ solution_id: solutionId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao deletar o upvote dessa solução',
          status,
        )
      }

      return new ApiResponse()
    },
  }
}
