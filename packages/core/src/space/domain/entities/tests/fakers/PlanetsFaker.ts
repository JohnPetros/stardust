import { faker } from '@faker-js/faker'
import { Planet } from '../../Planet'
import { StarsFaker } from './StarsFaker'
import type { PlanetDto } from '../../../../dtos'

export class PlanetsFaker {
  static fake(baseDto?: Partial<PlanetDto>): Planet {
    return Planet.create(PlanetsFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<PlanetDto>): PlanetDto {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      position: faker.number.int({ min: 1, max: 20 }),
      icon: `${faker.image.avatar()}.jpg`,
      image: `${faker.image.avatar()}.jpg`,
      stars: StarsFaker.fakeManyDto(faker.number.int({ min: 3, max: 10 })),
      ...baseDto,
    }
  }

  static fakeMany(count?: number): Planet[] {
    return Array.from({ length: count ?? 10 }).map(() => PlanetsFaker.fake())
  }

  static fakeManyDto(count?: number): PlanetDto[] {
    return Array.from({ length: count ?? 10 }).map(() => PlanetsFaker.fake().dto)
  }
}
