import { faker } from '@faker-js/faker'
import { Tier } from '../../Tier'
import type { TierDTO } from '@/@core/dtos'

export class TiersFaker {
  static fake(baseDTO?: Partial<TierDTO>): Tier {
    return Tier.create(TiersFaker.fakeDTO(baseDTO))
  }

  static fakeDTO(baseDTO?: Partial<TierDTO>): TierDTO {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      image: `${faker.image.avatar()}.jpg`,
      position: faker.number.int({ min: 1, max: 100 }),
      reward: faker.number.int({ max: 100 }),
      ...baseDTO,
    }
  }

  static fakeMany(count?: number): Tier[] {
    return Array.from({ length: count ?? 10 }).map(() => TiersFaker.fake())
  }

  static fakeManyDTO(count?: number): TierDTO[] {
    return Array.from({ length: count ?? 10 }).map(() => TiersFaker.fakeDTO())
  }
}
