import type { AuthorAggregateDto } from '../../../../global/domain/entities/dtos'

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
