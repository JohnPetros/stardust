import { RestResponse, PaginationResponse } from '@stardust/core/global/responses'
import type { ChallengesListParams } from '@stardust/core/challenging/types'
import type { ChallengeCategoryDto } from '@stardust/core/challenging/dtos'
import type { IChallengingService } from '@stardust/core/global/interfaces'

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

      return new RestResponse({ body: challengeDto })
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

      return new RestResponse({ body: challengeDto })
    },

    async fetchSolutionById(solutionId) {
      const { data, error, status } = await supabase
        .from('solutions_view')
        .select('*')
        .eq('id', solutionId)
        .single()

      if (error) {
        return SupabasePostgrestError(error, 'Solução não encontrado com esse id', status)
      }

      const solutionDto = supabaseSolutionMapper.toDto(data)

      return new RestResponse({ body: solutionDto })
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
          'Desafio não encontrado para essa estrela',
          status,
        )
      }

      return new RestResponse({ body: supabaseChallengeMapper.toDto(data) })
    },

    async fetchChallengeBySolutionId(solutionId: string) {
      const {
        data: solutionData,
        error: solutionError,
        status: solutionStatus,
      } = await supabase
        .from('solutions')
        .select('challenge_id')
        .eq('id', solutionId)
        .single()

      if (solutionError) {
        return SupabasePostgrestError(
          solutionError,
          'solução não encontrada com esse id',
          solutionStatus,
        )
      }

      const { data, error, status } = await supabase
        .from('challenges_view')
        .select('*')
        .eq('id', solutionData.challenge_id)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Desafio não encontrado para essa solução',
          status,
        )
      }

      return new RestResponse({ body: supabaseChallengeMapper.toDto(data) })
    },

    async fetchCompletableChallenges(userId: string) {
      const { data, error, status } = await supabase
        .from('challenges')
        .select('id, difficulty_level')
        .neq('user_id', userId)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro ao buscar desafios completáveis',
          status,
        )
      }

      return new RestResponse({
        body: data.map(({ id, difficulty_level }) => {
          return {
            id,
            difficulty: difficulty_level,
          }
        }),
      })
    },

    async fetchChallengesList({
      page,
      itemsPerPage,
      categoriesIds,
      difficultyLevel,
      postOrder,
      upvotesCountOrder,
      title,
      userId,
    }: ChallengesListParams) {
      let query = supabase
        .from('challenges_view')
        .select('*, challenges_categories!inner(category_id)', { count: 'exact' })
        .is('star_id', null)

      if (title && title.length > 1) {
        query = query.ilike('title', `%${title}%`)
      }

      if (difficultyLevel !== 'all') {
        query = query.eq('difficulty_level', difficultyLevel)
      }

      if (difficultyLevel !== 'all') {
        query = query.eq('difficulty_level', difficultyLevel)
      }

      if (postOrder !== 'all') {
        query = query.order('created_at', { ascending: postOrder === 'ascending' })
      }

      if (upvotesCountOrder !== 'all') {
        query = query.order('upvotes_count', {
          ascending: upvotesCountOrder === 'ascending',
        })
      }

      if (upvotesCountOrder !== 'all') {
        query = query.order('upvotes_count', {
          ascending: upvotesCountOrder === 'ascending',
        })
      }

      if (userId) {
        query = query.eq('user_id', userId)
      }

      if (categoriesIds.length) {
        query = query.in('challenges_categories.category_id', categoriesIds)
      }

      const range = calculateSupabaseRange(page, itemsPerPage)

      const { data, count, status, error } = await query.range(range.from, range.to)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Error inesperado ao filtrar desafios',
          status,
        )
      }

      const challenges = data.map(supabaseChallengeMapper.toDto)

      return new RestResponse({ body: new PaginationResponse(challenges, Number(count)) })
    },

    async fetchSolutionsList({ page, itemsPerPage, title, sorter, userId, challengeId }) {
      let query = supabase.from('solutions_view').select('*', { count: 'exact' })

      if (challengeId) {
        query = query.eq('challenge_id', challengeId)
      }

      if (userId) {
        query = query.eq('author_id', userId)
      }

      if (title && title.length > 1) {
        query = query.ilike('title', `%${title}%`)
      }

      switch (sorter) {
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

      return new RestResponse({ body: new PaginationResponse(solutions, Number(count)) })
    },

    async fetchCategories() {
      const { data, error } = await supabase
        .from('categories')
        .select('*, challenges:challenges_categories(id:challenge_id)')
        .order('name')

      if (error) {
        return SupabasePostgrestError(error, 'Error inesperado ao buscar categorias')
      }

      const categories: ChallengeCategoryDto[] = data.map((category) => ({
        id: category.id,
        name: category.name,
      }))

      return new RestResponse({ body: categories })
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

      return new RestResponse({ body: { challengeVote: data.vote } })
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
          'Solução não encontrado com esse slug',
          status,
        )
      }

      const challengeDto = supabaseSolutionMapper.toDto(data)

      return new RestResponse({ body: challengeDto })
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

      return new RestResponse({ body: docs })
    },

    async saveChallenge(challenge) {
      const supabaseChallenge = supabaseChallengeMapper.toSupabase(challenge)
      const { error, status } = await supabase.from('challenges').insert({
        // @ts-ignore
        id: supabaseChallenge.id,
        title: supabaseChallenge.title,
        difficulty_level: supabaseChallenge.difficulty_level,
        slug: supabaseChallenge.slug,
        description: supabaseChallenge.description,
        code: supabaseChallenge.code,
        test_cases: supabaseChallenge.test_cases,
        user_id: supabaseChallenge.user_id,
      })

      if (error) {
        return SupabasePostgrestError(error, 'Erro inesperado ao salvar desafio', status)
      }

      return new RestResponse()
    },

    async saveChallengeCategories(challengeId, challengeCategories) {
      const { error, status } = await supabase.from('challenges_categories').insert(
        challengeCategories.map((category) => ({
          challenge_id: challengeId,
          category_id: category.id,
        })),
      )

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao salvar as categorias desse desafio',
          status,
        )
      }

      return new RestResponse()
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

      return new RestResponse()
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

      return new RestResponse()
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

      return new RestResponse()
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

      return new RestResponse()
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

      return new RestResponse()
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

      return new RestResponse()
    },

    async updateChallenge(challenge) {
      const challengeDto = challenge.dto
      const { error, status } = await supabase
        .from('challenges')
        .update({
          // @ts-ignore
          id: challengeDto.id,
          title: challengeDto.title,
          difficulty_level: challengeDto.difficultyLevel,
          slug: challengeDto.slug,
          description: challengeDto.description,
          is_public: challengeDto.isPublic,
          code: challengeDto.code,
          test_cases: JSON.stringify(challengeDto.testCases),
          user_id: challengeDto.author.id,
        })
        .eq('id', challenge.id)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao salvar esse desafio',
          status,
        )
      }

      return new RestResponse()
    },

    async deleteChallenge(challengeId) {
      const { error, status } = await supabase
        .from('challenges')
        .delete()
        .eq('id', challengeId)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Error inesperado ao deletar desafio',
          status,
        )
      }

      return new RestResponse()
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

      return new RestResponse()
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

      return new RestResponse()
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

      return new RestResponse()
    },

    async deleteChallengeCategories(challengeId: string) {
      const { error, status } = await supabase
        .from('challenges_categories')
        .delete()
        .eq('challenge_id', challengeId)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao deletar as categorias desse desafio',
          status,
        )
      }

      return new RestResponse()
    },
  }
}
