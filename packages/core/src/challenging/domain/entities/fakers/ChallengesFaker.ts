import { faker } from '@faker-js/faker'

import type { ChallengeDto } from '../dtos'
import { Challenge } from '..'
import { AuthorsFakers } from '#global/domain/entities/fakers/AuthorsFakers'

export class ChallengesFaker {
  static fake(baseDto?: Partial<ChallengeDto>): Challenge {
    return Challenge.create(ChallengesFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<ChallengeDto>): ChallengeDto {
    return {
      id: faker.string.uuid(),
      title: faker.person.firstName(),
      difficultyLevel: faker.helpers.arrayElement(['easy', 'medium', 'hard']),
      slug: faker.lorem.slug(),
      code: '',
      categories: [],
      author: {
        id: faker.string.uuid(),
        entity: AuthorsFakers.fakeDto(),
      },
      testCases: [],
      description: '',
      completionsCount: 0,
      downvotesCount: 0,
      upvotesCount: 0,
      starId: '',
      ...baseDto,
    }
  }

  static fakeManyDto(count?: number, baseDto?: Partial<ChallengeDto>): ChallengeDto[] {
    return Array.from({ length: count ?? 10 }).map(
      () => ChallengesFaker.fake(baseDto).dto,
    )
  }
}
