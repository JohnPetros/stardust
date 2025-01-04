import type { AuthorDto } from '#global/dtos'

export type SolutionDto = {
  id?: string
  title: string
  slug: string
  content: string
  viewsCount?: number
  commentsCount?: number
  createdAt?: Date
  author: {
    id: string
    dto?: AuthorDto
  }
}
