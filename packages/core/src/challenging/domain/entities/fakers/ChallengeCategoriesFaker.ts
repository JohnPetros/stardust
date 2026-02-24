import { faker } from '@faker-js/faker'

import type { ChallengeCategoryDto } from '../dtos'
import { ChallengeCategory } from '..'

export class ChallengeCategoriesFaker {
  static fake(baseDto?: Partial<ChallengeCategoryDto>): ChallengeCategory {
    return ChallengeCategory.create(ChallengeCategoriesFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<ChallengeCategoryDto>): ChallengeCategoryDto {
    return {
      id: faker.string.uuid(),
      name: faker.lorem.word(),
      ...baseDto,
    }
  }

  static fakeManyDto(
    count?: number,
    baseDto?: Partial<ChallengeCategoryDto>,
  ): ChallengeCategoryDto[] {
    return Array.from({ length: count ?? 10 }).map(() =>
      ChallengeCategoriesFaker.fakeDto(baseDto),
    )
  }
}
