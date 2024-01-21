import { ICommentsController } from '../../interfaces/ICommentsController'
import type { Supabase } from '../types/supabase'

import type { Comment } from '@/@types/commnet'
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
        .select('*, user:users(slug, name, avatar_id), replies:comments(*)')

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

      const { data, error } = await query
        .eq('challenge_id', challengeId)
        .returns<Comment[]>()

      if (error) {
        throw new Error(error.message)
      }

      console.log({ data })

      const comments: Comment[] = data.map((comment) => ({
        id: comment.id,
        content: comment.content,
        created_at: comment.created_at,
        challenge_id: comment.challenge_id,
        parent_comment_id: comment.parent_comment_id,
        user: comment.user,
      }))

      return comments
    },
  }
}
