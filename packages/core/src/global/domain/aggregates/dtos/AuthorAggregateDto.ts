import type { AuthorDto } from '../../entities/dtos'

export type AuthorAggregateDto = {
  id: string
  entity?: Omit<AuthorDto, 'id'>
}
