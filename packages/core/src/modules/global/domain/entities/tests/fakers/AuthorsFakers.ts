import { faker } from '@faker-js/faker'

import { Author } from '../../Author'
import type { AuthorDto } from '#global/dtos'

export class AuthorsFakers {
  static fake(baseDto?: Partial<AuthorDto>): Author {
    return Author.create(AuthorsFakers.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<AuthorDto>): AuthorDto {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      slug: faker.lorem.slug(),
      avatar: {
        name: faker.person.firstName(),
        image: `${faker.image.avatar()}.jpg`,
      },
      ...baseDto,
    }
  }

  static fakeMany(count?: number): Author[] {
    return Array.from({ length: count ?? 10 }).map(() => AuthorsFakers.fake())
  }

  static fakeManyDto(count?: number, baseDto?: Partial<AuthorDto>): AuthorDto[] {
    return Array.from({ length: count ?? 10 }).map(() => AuthorsFakers.fakeDto(baseDto))
  }
}
