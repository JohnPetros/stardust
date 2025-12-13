import { faker } from '@faker-js/faker'

import type { InsigniaDto } from '../dtos'
import { Insignia } from '..'

export class InsigniasFaker {
  static fake(baseDto?: Partial<InsigniaDto>): Insignia {
    return Insignia.create({
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      image: `${faker.image.avatar()}.jpg`,
      price: faker.number.int({ max: 100 }),
      role: 'engineer',
      ...baseDto,
    })
  }

  static fakeMany(count?: number): Insignia[] {
    return Array.from({ length: count ?? 10 }).map(() => InsigniasFaker.fake())
  }

  static fakeDto(baseDto?: Partial<InsigniaDto>): InsigniaDto {
    return InsigniasFaker.fake(baseDto).dto
  }

  static fakeManyDto(count?: number, baseDto?: Partial<InsigniaDto>): InsigniaDto[] {
    return Array.from({ length: count ?? 10 }).map(() => InsigniasFaker.fakeDto(baseDto))
  }
}
