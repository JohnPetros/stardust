import type { AuthorDto } from '@/global/domain/entities/dtos'

export type AuthorAggregateDto = {
  id: string
  entity?: Omit<AuthorDto, 'id'>
}
