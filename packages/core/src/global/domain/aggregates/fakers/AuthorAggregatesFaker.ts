import { faker } from '@faker-js/faker'

import { AuthorAggregate } from '../AuthorAggregate'
import { AuthorsFakers } from '../../entities/fakers/AuthorsFakers'
import type { AuthorAggregateDto } from '../dtos'

export class AuthorAggregatesFaker {
  static fake(baseDto?: Partial<AuthorAggregateDto>): AuthorAggregate {
    return AuthorAggregate.create(AuthorAggregatesFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<AuthorAggregateDto>): AuthorAggregateDto {
    const fakeAvatar = AuthorsFakers.fake()
    return {
      id: faker.string.uuid(),
      entity: {
        name: fakeAvatar.name.value,
        slug: fakeAvatar.slug.value,
        avatar: {
          name: fakeAvatar.name.value,
          image: fakeAvatar.avatar.image.value,
        },
      },
      ...baseDto,
    }
  }
}
