import type { CommentDto } from '@stardust/core/forum/dtos'
import type { Comment } from '@stardust/core/forum/entities'
import type { SupabaseComment } from '../types'
import { Datetime } from '@stardust/core/libs'

export const SupabaseCommentMapper = () => {
  return {
    toDto(supabaseComment: SupabaseComment): CommentDto {
      const CommentDto: CommentDto = {
        id: supabaseComment.id ?? '',
        content: supabaseComment.content ?? '',
        repliesCount: supabaseComment.replies_count ?? 0,
        upvotesCount: supabaseComment.upvotes_count ?? 0,
        author: {
          id: supabaseComment.author_id ?? '',
          dto: {
            slug: supabaseComment.author_slug ?? '',
            name: supabaseComment.author_name ?? '',
            avatar: {
              name: supabaseComment.author_avatar_name ?? '',
              image: supabaseComment.author_avatar_image ?? '',
            },
          },
        },
        postedAt: new Datetime(supabaseComment.created_at).date(),
      }

      return CommentDto
    },

    toSupabase(comment: Comment): SupabaseComment {
      const commentDto = comment.dto

      const supabaseComment: SupabaseComment = {
        id: comment.id,
        content: commentDto.content,
        author_id: comment.authorId,
        created_at: comment.postedAt.toDateString(),
      } as SupabaseComment

      return supabaseComment
    },
  }
}
