import type { AuthorDto } from '#global/dtos'

export type SolutionDto = {
  id?: string
  title: string
  slug: string
  content: string
  createdAt: Date
  viewsCount: number
  commentsCount: number
  author: {
    id: string
    dto?: AuthorDto
  }
}
