import type { Supabase } from '../types/Supabase'
import { SupabasePostgrestError } from '../errors'
import { SupabaseCommentMapper, SupabaseTopicMapper } from '../mappers'
import { ApiResponse, PaginationResponse } from '@stardust/core/responses'
import type { IForumService } from '@stardust/core/interfaces'
import { calculateSupabaseRange } from '../utils'
import type { Comment, Topic } from '@stardust/core/forum/entities'

export const SupabaseForumService = (supabase: Supabase): IForumService => {
  const supabaseCommentMapper = SupabaseCommentMapper()
  const supabaseTopicMapper = SupabaseTopicMapper()

  return {
    async fetchChallengeTopic(challengeId, topicCategory) {
      const { data, error, status } = await supabase
        .from('challenge_forum_topics')
        .select('topics(*)')
        .eq('challenge_id', challengeId)
        .eq('topics.category', topicCategory)
        .single()

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inseperado ao buscar tópico desse desafio',
          status,
        )
      }

      if (!data.topics[0]) throw new Error()

      const topic = supabaseTopicMapper.toDto(data.topics[0])

      return new ApiResponse({ body: topic })
    },

    async fetchCommentById() {
      const { data, error, status } = await supabase
        .from('comments_view')
        .select('*')
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

    async fetchComments({ page, itemsPerPage, order, sorter, topicId }) {
      let query = supabase.from('comments_view').select('*', { count: 'exact' })

      if (sorter === 'date') {
        query = query.order('created_at', { ascending: order === 'ascending' })
      } else if (sorter === 'upvotes') {
        query = query.order('upvotes_count', { ascending: order === 'ascending' })
      }

      const range = calculateSupabaseRange(page, itemsPerPage)

      const { data, count, error, status } = await query
        .match({ topic_id: topicId, parent_comment_id: null })
        .range(range.from, range.to)

      if (error) {
        return SupabasePostgrestError(
          error,
          'Erro inesperado ao buscar comentãrios',
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

    async saveComment(comment: Comment, topic: Topic) {
      const supabaseComment = supabaseCommentMapper.toSupabase(comment)
      const supabaseTopic = supabaseTopicMapper.toSupabase(topic)

      await supabase
        .from('topics')
        .upsert({ id: topic.id, category: supabaseTopic.category })

      // @ts-ignore
      const { error, status } = await supabase.from('comments').insert({
        id: comment.id,
        content: supabaseComment.content,
        user_id: supabaseComment.author_id,
        parent_comment_id: supabaseComment.parent_comment_id,
        topic_id: topic.id,
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

    async deleteCommentUpvote(commentId: string) {
      const { error, status } = await supabase
        .from('users_upvoted_comments')
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
  }
}
