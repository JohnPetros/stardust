import type { AuthorDto } from '#global/dtos'

export type SolutionDto = {
  id?: string
  title: string
  content: string
  slug?: string
  upvotesCount?: number
  viewsCount?: number
  commentsCount?: number
  postedAt?: Date
  author: {
    id: string
    dto?: AuthorDto
  }
}
