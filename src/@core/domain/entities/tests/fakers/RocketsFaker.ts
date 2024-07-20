import { faker } from '@faker-js/faker'
import { Rocket } from '../../Rocket'
import type { RocketDTO } from '@/@core/dtos'

export class RocketsFaker {
  static fake(baseDTO?: Partial<RocketDTO>): Rocket {
    return Rocket.create({
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      image: `${faker.image.avatar()}.jpg`,
      price: faker.number.int({ max: 100 }),
      ...baseDTO,
    })
  }

  static fakeMany(count?: number): Rocket[] {
    return Array.from({ length: count ?? 10 }).map(() => RocketsFaker.fake())
  }
}
