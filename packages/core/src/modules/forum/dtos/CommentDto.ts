import type { AuthorDto } from '#global/dtos'

export type CommentDto = {
  id?: string
  content: string
  repliesCount?: number
  upvotesCount?: number
  postedAt?: Date
  author: {
    id: string
    dto?: AuthorDto
  }
}
