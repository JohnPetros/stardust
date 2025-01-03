import type { AuthorDto } from '#global/dtos'

export type SolutionDto = {
  id?: string
  title: string
  content: string
  createdAt: Date
  viewsCount: number
  author: {
    id: string
    dto?: AuthorDto
  }
}
