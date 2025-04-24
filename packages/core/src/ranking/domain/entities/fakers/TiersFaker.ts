import { faker } from '@faker-js/faker'

import type { TierDto } from '#ranking/dtos'
import { Tier } from '../Tier'

export class TiersFaker {
  static fake(baseDto?: Partial<TierDto>): Tier {
    return Tier.create(TiersFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<TierDto>): TierDto {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      image: `${faker.image.avatar()}.jpg`,
      position: faker.number.int({ min: 1, max: 100 }),
      reward: faker.number.int({ max: 100 }),
      ...baseDto,
    }
  }

  static fakeMany(count?: number): Tier[] {
    return Array.from({ length: count ?? 10 }).map(() => TiersFaker.fake())
  }

  static fakeManyDto(count?: number): TierDto[] {
    return Array.from({ length: count ?? 10 }).map(() => TiersFaker.fakeDto())
  }
}
