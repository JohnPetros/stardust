import { Comment } from '@stardust/core/forum/entities'
import type { DrizzleComment, DrizzleInsertComment } from '../../types/entities/forum'
export class DrizzleCommentMapper {
  static toEntity(row: DrizzleComment): Comment {
    return Comment.create({
      ...DrizzleCommentMapper.content(row),
      repliesCount: row.repliesCount,
      upvotesCount: row.upvotesCount,
      author: DrizzleCommentMapper.author(row),
    })
  }
  private static content(row: DrizzleComment) {
    return { id: row.id, content: row.content, postedAt: row.createdAt }
  }
  private static author(row: DrizzleComment): Comment['dto']['author'] {
    return {
      id: row.authorId ?? row.userId,
      entity: DrizzleCommentMapper.authorProfile(row),
    }
  }
  private static authorProfile(row: DrizzleComment) {
    return {
      name: row.authorName ?? '',
      slug: row.authorSlug ?? '',
      avatar: DrizzleCommentMapper.authorAvatar(row),
    }
  }
  private static authorAvatar(row: DrizzleComment) {
    return {
      name: row.authorAvatarName ?? '',
      image: row.authorAvatarImage ?? '',
    }
  }
  static toPersistence(comment: Comment): DrizzleInsertComment {
    return {
      id: comment.id.value,
      content: comment.content.value,
      userId: comment.author.id.value,
      createdAt: comment.postedAt,
    }
  }
}
