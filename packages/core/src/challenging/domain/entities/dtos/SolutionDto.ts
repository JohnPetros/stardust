import type { AuthorAggregateDto } from '#global/domain/aggregates/dtos/AuthorAggregateDto'

export type SolutionDto = {
  id?: string
  title: string
  content: string
  slug?: string
  upvotesCount?: number
  viewsCount?: number
  commentsCount?: number
  postedAt?: Date
  author: AuthorAggregateDto
}
