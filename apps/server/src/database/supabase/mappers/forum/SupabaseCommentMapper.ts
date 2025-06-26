import { Comment } from '@stardust/core/forum/entities'
import type { CommentDto } from '@stardust/core/forum/entities/dtos'
import { Datetime } from '@stardust/core/global/libs'
import type { SupabaseComment } from '../../types'

export class SupabaseCommentMapper {
  static toEntity(supabaseComment: SupabaseComment): Comment {
    return Comment.create(SupabaseCommentMapper.toDto(supabaseComment))
  }

  static toDto(supabaseComment: SupabaseComment): CommentDto {
    const CommentDto: CommentDto = {
      id: supabaseComment.id ?? '',
      content: supabaseComment.content ?? '',
      repliesCount: supabaseComment.replies_count ?? 0,
      upvotesCount: supabaseComment.upvotes_count ?? 0,
      author: {
        id: supabaseComment.author_id ?? '',
        entity: {
          slug: supabaseComment.author_slug ?? '',
          name: supabaseComment.author_name ?? '',
          avatar: {
            name: supabaseComment.author_avatar_name ?? '',
            image: supabaseComment.author_avatar_image ?? '',
          },
        },
      },
      postedAt: new Date(),
    }

    return CommentDto
  }

  static toSupabase(comment: Comment): SupabaseComment {
    const supabaseComment: SupabaseComment = {
      id: comment.id.value,
      content: comment.content.value,
      author_id: comment.author.id.value,
      created_at: comment.postedAt.toDateString(),
    } as SupabaseComment

    return supabaseComment
  }
}
