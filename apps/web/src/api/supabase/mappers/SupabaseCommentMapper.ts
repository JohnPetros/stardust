import type { CommentDto } from '@stardust/core/forum/dtos'
import type { Comment } from '@stardust/core/forum/entities'
import type { SupabaseComment } from '../types'

export const SupabaseCommentMapper = () => {
  return {
    toDto(supabaseComment: SupabaseComment): CommentDto {
      const CommentDto: CommentDto = {
        id: supabaseComment.id ?? '',
        content: supabaseComment.content ?? '',
        author: {
          slug: supabaseComment.author_slug ?? '',
          name: supabaseComment.author_slug ?? '',
          avatar: {
            name: supabaseComment.author_avatar_name ?? '',
            image: supabaseComment.author_avatar_image ?? '',
          },
        },
      }

      return CommentDto
    },

    toSupabase(comment: Comment): SupabaseComment {
      const commentDto = comment.dto

      const supabaseComment: SupabaseComment = {
        id: comment.id,
        content: commentDto.content,
        author_id: comment.author.id,
        author_slug: commentDto.author.slug,
        author_name: commentDto.author.name,
        author_avatar_name: commentDto.author.avatar.name,
        author_avatar_image: commentDto.author.avatar.image,
        parent_comment_id: comment.parentCommentId?.value ?? null,
        topic_id: '',
        replies_count: comment.repliesCount.value,
        upvotes_count: comment.upvotesCount.value,
        created_at: comment.createdAt.toDateString(),
      }

      return supabaseComment
    },
  }
}
