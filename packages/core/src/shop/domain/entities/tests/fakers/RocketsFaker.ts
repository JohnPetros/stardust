import { faker } from '@faker-js/faker'
import type { RocketDto } from '../../../../dtos'
import { Rocket } from '../..'

export class RocketsFaker {
  static fake(baseDto?: Partial<RocketDto>): Rocket {
    return Rocket.create({
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      image: `${faker.image.avatar()}.jpg`,
      price: faker.number.int({ max: 100 }),
      isAcquiredByDefault: false,
      isSelectedByDefault: false,
      ...baseDto,
    })
  }

  static fakeMany(count?: number): Rocket[] {
    return Array.from({ length: count ?? 10 }).map(() => RocketsFaker.fake())
  }
}
