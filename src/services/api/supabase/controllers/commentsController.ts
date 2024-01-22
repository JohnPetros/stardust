import { ICommentsController } from '../../interfaces/ICommentsController'
import type { Supabase } from '../types/supabase'

import type { Comment } from '@/@types/comment'
import { Order } from '@/@types/order'

export const CommentsController = (supabase: Supabase): ICommentsController => {
  return {
    getFilteredComments: async (
      challengeId: string,
      sorter: 'date' | 'upvotes',
      order: Order
    ) => {
      let query = supabase
        .from('comments')
        .select(
          'id, content, challenge_id, created_at, user:users(slug, avatar_id), replies:comments(count)'
        )

      switch (sorter) {
        case 'date':
          {
            query = query.order('created_at', {
              ascending: order === 'ascending',
            })
          }
          break
        case 'upvotes': {
          query = query.order('count_comments_upvotes', {
            ascending: true,
          })

          break
        }
      }

      query.is('parent_comment_id', null)

      const { data, error } = await query
        .eq('challenge_id', challengeId)
        .returns<(Comment & { replies: [{ count: number }] })[]>()

      if (error) {
        throw new Error(error.message)
      }

      const comments: Comment[] = data.map((comment) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        challenge_id: comment.challenge_id,
        parent_comment_id: comment.parent_comment_id,
        user: comment.user,
        repliesAmount: comment.replies[0].count,
      }))

      return comments
    },

    getUserUpvotedCommentsIds: async (userId: string) => {
      const { data, error } = await supabase
        .from('users_upvoted_comments')
        .select('comment_id')
        .eq('user_id', userId)
        .returns<{ comment_id: string }[]>()

      if (error) {
        throw new Error(error.message)
      }

      return data.map(({ comment_id }) => comment_id)
    },

    getCommentReplies: async (commentId: string) => {
      const { data, error } = await supabase
        .from('comments')
        .select(
          'id, content, challenge_id, created_at, user:users(slug, avatar_id), replies:comments(count)'
        )
        .eq('parent_comment_id', commentId)
        .returns<(Comment & { replies: [{ count: number }] })[]>()

      console.log({ data })

      if (error) {
        throw new Error(error.message)
      }

      const replies: Comment[] = data.map((reply) => ({
        id: reply.id,
        content: reply.content,
        created_at: reply.created_at,
        challenge_id: reply.challenge_id,
        parent_comment_id: reply.parent_comment_id,
        user: reply.user,
        repliesAmount: reply.replies[0].count,
      }))

      return replies
    },

    postComment: async (
      comment: Omit<Comment, 'id' | 'user'>,
      userId: string
    ) => {
      const { error } = await supabase.from('comments').insert([
        {
          content: comment.content,
          challenge_id: comment.challenge_id,
          parent_comment_id: comment.parent_comment_id,
          user_id: userId,
        },
      ])

      if (error) {
        throw new Error(error.message)
      }
    },
  }
}
