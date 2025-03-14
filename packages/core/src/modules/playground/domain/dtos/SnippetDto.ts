import type { AuthorDto } from '#global/dtos'

export type SnippetDto = {
  id?: string
  title?: string
  code: string
  isPublic: boolean
  createdAt?: Date
  author: {
    id: string
    dto?: AuthorDto
  }
}
