import { faker } from '@faker-js/faker'
import { Planet } from '../../Planet'
import type { PlanetDTO } from '@/@core/dtos'
import { StarsFaker } from './StarsFaker'

export class PlanetsFaker {
  static fake(baseDTO?: Partial<PlanetDTO>): Planet {
    return Planet.create(PlanetsFaker.fakeDTO(baseDTO))
  }

  static fakeDTO(baseDTO?: Partial<PlanetDTO>): PlanetDTO {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      position: faker.number.int({ min: 1, max: 20 }),
      icon: `${faker.image.avatar()}.jpg`,
      image: `${faker.image.avatar()}.jpg`,
      stars: StarsFaker.fakeManyDTO(faker.number.int({ min: 3, max: 10 })),
      ...baseDTO,
    }
  }

  static fakeMany(count?: number): Planet[] {
    return Array.from({ length: count ?? 10 }).map(() => PlanetsFaker.fake())
  }

  static fakeManyDTO(count?: number): PlanetDTO[] {
    return Array.from({ length: count ?? 10 }).map(() => PlanetsFaker.fake().dto)
  }
}
