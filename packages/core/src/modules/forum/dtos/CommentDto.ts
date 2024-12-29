import type { AuthorDto } from './AuthorDto'

export type CommentDto = {
  id?: string
  content: string
  repliesCount?: number
  upvotesCount?: number
  parentCommentId?: string
  createdAt?: Date
  author: AuthorDto
}
