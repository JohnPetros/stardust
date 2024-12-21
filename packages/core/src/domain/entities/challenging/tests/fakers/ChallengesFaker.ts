import { faker } from '@faker-js/faker'

import { Challenge } from '../../Challenge'
import type { ChallengeDto } from '../../../#dtos'

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
      ...baseDto,
    }
  }

  static fakeManyDto(count?: number, baseDto?: Partial<ChallengeDto>): ChallengeDto[] {
    return Array.from({ length: count ?? 10 }).map(
      () => ChallengesFaker.fake(baseDto).dto,
    )
  }
}
