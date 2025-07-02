import { faker } from '@faker-js/faker'

import type { SnippetDto } from '../dtos'
import { Snippet } from '../Snippet'

export class SnippetsFaker {
  static fake(baseDto?: Partial<SnippetDto>): Snippet {
    return Snippet.create(SnippetsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<SnippetDto>): SnippetDto {
    return {
      id: faker.string.uuid(),
      title: faker.person.firstName(),
      code: faker.person.firstName(),
      isPublic: faker.datatype.boolean(),
      createdAt: faker.date.recent(),
      author: {
        id: faker.string.uuid(),
      },
      ...baseDto,
    }
  }

  static fakeMany(count?: number): Snippet[] {
    return Array.from({ length: count ?? 10 }).map(() => SnippetsFaker.fake())
  }

  static fakeManyDto(count?: number): SnippetDto[] {
    return Array.from({ length: count ?? 10 }).map(() => SnippetsFaker.fakeDto())
  }
}
