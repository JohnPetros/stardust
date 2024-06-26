import { ICommentsController } from '../../interfaces/ICommentsController'
import type { Order } from '../../types/Order'
import { SupabaseCommentAdapter } from '../adapters/SupabaseCommentAdapter'
import type { Supabase } from '../types/Supabase'
import { SupabaseComment } from '../types/SupabaseComment'

import type { Comment } from '@/@types/Comment'

type BaseComment = Pick<Comment, 'content' | 'challengeId' | 'parentCommentId'>

export const SupabaseCommentsController = (
  supabase: Supabase
): ICommentsController => {
  return {
    async getFilteredComments(
      challengeId: string,
      sorter: 'date' | 'upvotes',
      order: Order
    ) {
      let query = supabase
        .from('comments')
        .select(
          'id, content, challenge_id, created_at, user:users(slug, avatar_id), replies:comments(count), upvotes:users_upvoted_comments(count)'
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
        .returns<SupabaseComment[]>()

      if (error) {
        throw new Error(error.message)
      }

      const comments: Comment[] = data.map(SupabaseCommentAdapter)

      return comments
    },

    async getUserUpvotedCommentsIds(userId: string) {
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

    async getCommentReplies(commentId: string) {
      const { data, error } = await supabase
        .from('comments')
        .select(
          'id, content, parent_comment_id, challenge_id, created_at, user:users(slug, avatar_id), replies:comments(count), upvotes:users_upvoted_comments(count)'
        )
        .eq('parent_comment_id', commentId)
        .order('created_at', { ascending: false })
        .returns<SupabaseComment[]>()

      if (error) {
        throw new Error(error.message)
      }


      const replies: Comment[] = data.map(SupabaseCommentAdapter)

      return replies
    },

    async editComment(id: string, userSlug: string, content: string) {
      const { error } = await supabase
        .from('comments')
        .update({ content })
        .match({ id, user_slug: userSlug })

      if (error) {
        throw new Error(error.message)
      }
    },

    async deleteComment(id: string, userSlug: string) {
      const { error } = await supabase
        .from('comments')
        .delete()
        .match({ id, user_slug: userSlug })

      if (error) {
        throw new Error(error.message)
      }
    },

    async postComment(
      comment: BaseComment,
      userSlug: string
    ) {
      const { error } = await supabase.from('comments').insert(
        {
          content: comment.content,
          challenge_id: comment.challengeId,
          parent_comment_id: comment.parentCommentId,
          user_slug: userSlug,
        },
      )

      console.log(comment)
      console.log(userSlug)

      if (error) {
        throw new Error(error.message)
      }
    },

    async addUpvotedComment(commentId: string, userId: string) {
      const { error } = await supabase.from('users_upvoted_comments').insert({
        comment_id: commentId,
        user_id: userId,
      })

      if (error) {
        throw new Error(error.message)
      }
    },

    async removeUpvotedComment(commentId: string, userId: string) {
      const { error } = await supabase
        .from('users_upvoted_comments')
        .delete()
        .match({ comment_id: commentId, user_id: userId })

      if (error) {
        throw new Error(error.message)
      }
    },
  }
}
