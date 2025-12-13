import { faker } from '@faker-js/faker'

import { AuthorAggregate } from '../AuthorAggregate'
import { AuthorsFakers } from '../../entities/fakers/AuthorsFakers'
import type { AuthorAggregateDto } from '../dtos'

export class AuthorAggregatesFaker {
  static fake(baseDto?: Partial<AuthorAggregateDto>): AuthorAggregate {
    return AuthorAggregate.create(AuthorAggregatesFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<AuthorAggregateDto>): AuthorAggregateDto {
    const fakeAuthor = AuthorsFakers.fake()
    return {
      id: faker.string.uuid(),
      entity: {
        name: fakeAuthor.name.value,
        slug: fakeAuthor.slug.value,
        avatar: {
          name: fakeAuthor.name.value,
          image: fakeAuthor.avatar.image.value,
        },
      },
      ...baseDto,
    }
  }
}
