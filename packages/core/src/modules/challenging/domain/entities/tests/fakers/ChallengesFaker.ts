import { faker } from '@faker-js/faker'

import type { ChallengeDto } from '#challenging/dtos'
import { Challenge } from '#challenging/entities'
import { AuthorsFakers } from '#fakers/entities'

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
        dto: AuthorsFakers.fakeDto(),
      },
      testCases: [],
      textBlocks: [],
      description: '',
      completionsCount: 0,
      downvotesCount: 0,
      upvotesCount: 0,
      docId: '',
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
