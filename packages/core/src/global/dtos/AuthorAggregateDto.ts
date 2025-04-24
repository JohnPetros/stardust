import type { AuthorDto } from './AuthorDto'

export type AuthorAggregateDto = {
  id: string
  entity?: Omit<AuthorDto, 'id'>
}
