import { ApiResponse, PaginationResponse } from '@stardust/core/responses'
import type { IForumService } from '@stardust/core/interfaces'
import type { Comment } from '@stardust/core/forum/entities'

import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { SupabaseCommentMapper } from '../mappers'
import { calculateSupabaseRange } from '../utils'

export const SupabaseForumService = (supabase: Supabase): IForumService => {
  const supabaseCommentMapper = SupabaseCommentMapper()

  return {
    async fetchCommentById(commentId: string) {
      const { data, error, status } = await supabase
        .from('comments_view')
        .select('*')
        .eq('id', commentId)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inseperado ao buscar esse comentário',
          status,
        )
      }

      const comment = supabaseCommentMapper.toDto(data)
      return new ApiResponse({ body: comment })
    },

    async fetchChallengeCommentsList(
      { page, itemsPerPage, order, sorter },
      challengeId: string,
    ) {
      let query = supabase
        .from('comments_view')
        .select('*, challenges_comments!inner(challenge_id)', { count: 'exact' })

      if (sorter === 'date') {
        query = query.order('created_at', { ascending: order === 'ascending' })
      } else if (sorter === 'upvotes') {
        query = query.order('upvotes_count', { ascending: order === 'ascending' })
      }

      const range = calculateSupabaseRange(page, itemsPerPage)

      const { data, count, error, status } = await query
        .eq('challenges_comments.challenge_id', challengeId)
        .is('parent_comment_id', null)
        .range(range.from, range.to)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar comentários desse desafio',
          status,
        )
      }

      const comments = data.map(supabaseCommentMapper.toDto)

      return new ApiResponse({ body: new PaginationResponse(comments, Number(count)) })
    },

    async fetchSolutionCommentsList(
      { page, itemsPerPage, order, sorter },
      solutionId: string,
    ) {
      let query = supabase
        .from('comments_view')
        .select('*, solutions_comments!inner(solution_id)', { count: 'exact' })

      if (sorter === 'date') {
        query = query.order('created_at', { ascending: order === 'ascending' })
      } else if (sorter === 'upvotes') {
        query = query.order('upvotes_count', { ascending: order === 'ascending' })
      }

      const range = calculateSupabaseRange(page, itemsPerPage)

      const { data, count, error, status } = await query
        .eq('solutions_comments.solution_id', solutionId)
        .is('parent_comment_id', null)
        .range(range.from, range.to)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar comentários dessa solução',
          status,
        )
      }

      const comments = data.map(supabaseCommentMapper.toDto)

      return new ApiResponse({ body: new PaginationResponse(comments, Number(count)) })
    },

    async fetchCommentReplies(commentId: string) {
      const { data, error, status } = await supabase
        .from('comments_view')
        .select('*')
        .eq('parent_comment_id', commentId)
        .order('created_at', { ascending: false })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar comentãrios',
          status,
        )
      }

      const replies = data.map(supabaseCommentMapper.toDto)

      return new ApiResponse({ body: replies })
    },

    async saveChallengeComment(comment: Comment, challengeId: string) {
      const supabaseComment = supabaseCommentMapper.toSupabase(comment)

      console.log(supabaseComment)

      const { error: commentError, status: commentStatus } = await supabase
        .from('comments')
        .insert({
          // @ts-ignore
          id: comment.id,
          content: supabaseComment.content,
          user_id: supabaseComment.author_id,
        })

      if (commentError) {
        return SupabasePostgrestError(
          commentError,
          'Erro inesperado ao salvar comentário desse desafio',
          commentStatus,
        )
      }

      const { error: challengeCommentError, status: challengeCommentStatus } =
        await supabase
          .from('challenges_comments')
          .insert({ comment_id: comment.id, challenge_id: challengeId })

      if (challengeCommentError) {
        return SupabasePostgrestError(
          challengeCommentError,
          'Erro inesperado ao salvar comentário desse desafio',
          challengeCommentStatus,
        )
      }

      return new ApiResponse()
    },

    async saveSolutionComment(comment: Comment, solutionId: string) {
      const supabaseComment = supabaseCommentMapper.toSupabase(comment)

      const { error: commentError, status: commentStatus } = await supabase
        .from('comments')
        .insert({
          // @ts-ignore
          id: comment.id,
          content: supabaseComment.content,
          user_id: supabaseComment.author_id,
        })

      if (commentError) {
        return SupabasePostgrestError(
          commentError,
          'Erro inesperado ao salvar comentário dessa solução',
          commentStatus,
        )
      }

      const { error: solutionCommentError, status: solutionCommentStatus } =
        await supabase
          .from('solutions_comments')
          .insert({ comment_id: comment.id, solution_id: solutionId })

      if (solutionCommentError) {
        return SupabasePostgrestError(
          solutionCommentError,
          'Erro inesperado ao salvar comentário dessa solução',
          solutionCommentStatus,
        )
      }

      return new ApiResponse()
    },

    async saveCommentReply(reply: Comment, commentId: string) {
      const supabaseReply = supabaseCommentMapper.toSupabase(reply)

      const { error, status } = await supabase.from('comments').insert({
        // @ts-ignore
        id: reply.id,
        content: supabaseReply.content,
        user_id: supabaseReply.author_id,
        parent_comment_id: commentId,
      })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao salvar comentário',
          status,
        )
      }

      return new ApiResponse()
    },

    async saveCommentUpvote(commentId, userId) {
      const { error, status } = await supabase.from('users_upvoted_comments').insert({
        comment_id: commentId,
        user_id: userId,
      })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao salvar upvote de comentário',
          status,
        )
      }

      return new ApiResponse()
    },

    async updateCommentContent(commentContent: string, commentId: string) {
      const { error, status } = await supabase
        .from('comments')
        .update({
          content: commentContent,
        })
        .eq('id', commentId)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao atualizar conteúdo do comentário',
          status,
        )
      }

      return new ApiResponse()
    },

    async deleteComment(commentId: string) {
      const { error, status } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao deletar comentário',
          status,
        )
      }

      return new ApiResponse()
    },

    async deleteCommentUpvote(commentId: string, userId: string) {
      const { error, status } = await supabase
        .from('users_upvoted_comments')
        .delete()
        .match({ comment_id: commentId, user_id: userId })

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao deletar o upvote desse comentário',
          status,
        )
      }

      return new ApiResponse()
    },
  }
}
