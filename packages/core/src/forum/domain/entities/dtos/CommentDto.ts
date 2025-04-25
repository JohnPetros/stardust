import type { AuthorAggregateDto } from '@/global/domain/aggregates/dtos'

export type CommentDto = {
  id?: string
  content: string
  repliesCount?: number
  upvotesCount?: number
  postedAt?: Date
  author: AuthorAggregateDto
}
