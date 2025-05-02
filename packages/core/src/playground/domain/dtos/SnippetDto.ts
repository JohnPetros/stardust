import type { AuthorAggregateDto } from "#global/domain/aggregates/dtos/index"

export type SnippetDto = {
  id?: string
  title?: string
  code: string
  isPublic: boolean
  createdAt?: Date
  author: AuthorAggregateDto
}
