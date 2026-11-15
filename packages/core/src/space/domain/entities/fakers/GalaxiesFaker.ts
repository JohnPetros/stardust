import { faker } from '@faker-js/faker'

import type { GalaxyDto } from '../dtos'
import { Galaxy } from '../Galaxy'

export class GalaxiesFaker {
  static fake(baseDto?: Partial<GalaxyDto>): Galaxy {
    return Galaxy.create(GalaxiesFaker.fakeDto(baseDto))
  }

  static fakeDto(baseDto?: Partial<GalaxyDto>): GalaxyDto {
    const name = faker.lorem.words(2)

    return {
      id: faker.string.uuid(),
      slug: faker.helpers
        .slugify(`${name}-${faker.string.alphanumeric(4)}`)
        .toLowerCase(),
      name,
      description: faker.lorem.sentence(),
      animation: `${faker.helpers.slugify(name).toLowerCase()}.json`,
      position: faker.number.int({ min: 1, max: 20 }),
      status: 'published',
      planetsIds: GalaxiesFaker.fakePlanetsIds(),
      ...baseDto,
    }
  }

  private static fakePlanetsIds(): string[] {
    const count = faker.number.int({ min: 1, max: 10 })
    return Array.from({ length: count }).map(() => faker.string.uuid())
  }

  static fakeMany(count?: number, baseDto?: Partial<GalaxyDto>): Galaxy[] {
    return Array.from({ length: count ?? 3 }).map(() => GalaxiesFaker.fake(baseDto))
  }

  static fakeManyDto(count?: number, baseDto?: Partial<GalaxyDto>): GalaxyDto[] {
    return Array.from({ length: count ?? 3 }).map(() => GalaxiesFaker.fakeDto(baseDto))
  }
}
