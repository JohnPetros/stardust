import { faker } from '@faker-js/faker'

import { ChallengeNavigation } from '../ChallengeNavigation'
import type { ChallengeNavigationDto } from '../dtos'

export class ChallengeNavigationFaker {
  static fake(baseDto?: Partial<ChallengeNavigationDto>) {
    return ChallengeNavigation.create(ChallengeNavigationFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<ChallengeNavigationDto>): ChallengeNavigationDto {
    return {
      previousChallengeSlug: faker.lorem.slug(),
      nextChallengeSlug: faker.lorem.slug(),
      ...baseDto,
    }
  }
}
