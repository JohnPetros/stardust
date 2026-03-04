import { faker } from '@faker-js/faker'

import type { ChallengeSourceDto } from '../dtos'
import { ChallengeSource } from '..'
import { ChallengesFaker } from './ChallengesFaker'

export class ChallengeSourcesFaker {
  static fake(baseDto?: Partial<ChallengeSourceDto>): ChallengeSource {
    return ChallengeSource.create(ChallengeSourcesFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<ChallengeSourceDto>): ChallengeSourceDto {
    const challenge = ChallengesFaker.fakeDto()
    const dto: ChallengeSourceDto = {
      id: faker.string.uuid(),
      url: faker.internet.url(),
      isUsed: faker.datatype.boolean(),
      position: faker.number.int({ min: 1, max: 100 }),
      challenge: {
        id: challenge.id ?? faker.string.uuid(),
        title: challenge.title,
        slug: challenge.slug ?? faker.lorem.slug(),
      },
    }

    return {
      ...dto,
      ...baseDto,
      challenge: baseDto?.challenge ?? dto.challenge,
    }
  }

  static fakeMany(count?: number): ChallengeSource[] {
    return Array.from({ length: count ?? 10 }).map(() => ChallengeSourcesFaker.fake())
  }

  static fakeManyDto(
    count?: number,
    baseDto?: Partial<ChallengeSourceDto>,
  ): ChallengeSourceDto[] {
    return Array.from({ length: count ?? 10 }).map(() =>
      ChallengeSourcesFaker.fakeDto(baseDto),
    )
  }
}
