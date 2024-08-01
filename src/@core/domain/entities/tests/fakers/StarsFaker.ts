import { faker } from '@faker-js/faker'
import { Star } from '../../Star'
import type { StarDTO } from '@/@core/dtos'

export class StarsFaker {
  static fake(baseDTO?: Partial<StarDTO>): Star {
    return Star.create(StarsFaker.fakeDTO(baseDTO))
  }

  static fakeDTO(baseDTO?: Partial<StarDTO>): StarDTO {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      number: faker.number.int({ min: 1, max: 20 }),
      slug: faker.lorem.slug(),
      isChallenge: false,
      ...baseDTO,
    }
  }

  static fakeMany(count?: number): Star[] {
    return Array.from({ length: count ?? 10 }).map(() => StarsFaker.fake())
  }

  static fakeManyDTO(count?: number): StarDTO[] {
    return Array.from({ length: count ?? 10 }).map(() => StarsFaker.fake().dto)
  }
}
