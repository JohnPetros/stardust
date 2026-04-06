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
      position: faker.number.int({ min: 1, max: 100 }),
      additionalInstructions: faker.lorem.sentences(2),
      challenge: {
        id: challenge.id ?? faker.string.uuid(),
        title: challenge.title ?? faker.lorem.words(3),
        slug: challenge.slug ?? faker.lorem.slug(),
      },
    }

    if (baseDto?.challenge === null) {
      return {
        id: baseDto.id ?? dto.id,
        url: baseDto.url ?? dto.url,
        position: baseDto.position ?? dto.position,
        additionalInstructions:
          baseDto.additionalInstructions ?? dto.additionalInstructions,
        challenge: null,
      }
    }

    const mergedChallenge: NonNullable<ChallengeSourceDto['challenge']> = {
      id: baseDto?.challenge?.id ?? dto.challenge?.id ?? faker.string.uuid(),
      title: baseDto?.challenge?.title ?? dto.challenge?.title ?? faker.lorem.words(3),
      slug: baseDto?.challenge?.slug ?? dto.challenge?.slug ?? faker.lorem.slug(),
    }

    return {
      id: baseDto?.id ?? dto.id,
      url: baseDto?.url ?? dto.url,
      position: baseDto?.position ?? dto.position,
      additionalInstructions:
        baseDto?.additionalInstructions ?? dto.additionalInstructions,
      challenge: mergedChallenge,
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
