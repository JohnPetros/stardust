import type { AuthorDto } from '#global/dtos'

export type CommentDto = {
  id?: string
  content: string
  repliesCount?: number
  upvotesCount?: number
  createdAt?: Date
  author: {
    id: string
    dto?: AuthorDto
  }
}
