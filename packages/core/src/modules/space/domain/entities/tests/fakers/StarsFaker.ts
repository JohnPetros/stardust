import { faker } from '@faker-js/faker'
import { Star } from '../../Star'
import type { StarDto } from '#space/dtos'

export class StarsFaker {
  static fake(baseDto?: Partial<StarDto>): Star {
    return Star.create(StarsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<StarDto>): StarDto {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      number: faker.number.int({ min: 1, max: 20 }),
      slug: faker.lorem.slug(),
      ...baseDto,
    }
  }

  static fakeMany(count?: number): Star[] {
    return Array.from({ length: count ?? 10 }).map(() => StarsFaker.fake())
  }

  static fakeManyDto(count?: number): StarDto[] {
    return Array.from({ length: count ?? 10 }).map(() => StarsFaker.fake().dto)
  }
}
