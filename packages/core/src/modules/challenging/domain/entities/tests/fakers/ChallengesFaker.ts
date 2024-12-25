import { faker } from '@faker-js/faker'

import type { ChallengeDto } from '#challenging/dtos'
import { Challenge } from '#challenging/entities'

export class ChallengesFaker {
  static fake(baseDto?: Partial<ChallengeDto>): Challenge {
    return Challenge.create(ChallengesFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<ChallengeDto>): ChallengeDto {
    return {
      id: faker.string.uuid(),
      title: faker.person.firstName(),
      difficulty: faker.helpers.arrayElement(['easy', 'medium', 'hard']),
      slug: faker.lorem.slug(),
      code: '',
      authorSlug: '',
      description: '',
      completionsCount: 0,
      downvotesCount: 0,
      upvotesCount: 0,
      functionName: '',
      descriptionTextBlocks: [],
      docId: '',
      starId: '',
      createdAt: new Date(),
      ...baseDto,
    }
  }

  static fakeManyDto(count?: number, baseDto?: Partial<ChallengeDto>): ChallengeDto[] {
    return Array.from({ length: count ?? 10 }).map(
      () => ChallengesFaker.fake(baseDto).dto,
    )
  }
}
