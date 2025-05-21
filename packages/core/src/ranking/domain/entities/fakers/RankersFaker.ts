import { faker } from '@faker-js/faker'

import type { RankingUserDto } from '../dtos'
import { RankingUser } from '../RankingUser'

export class RankersFaker {
  static fake(): RankingUser {
    return RankingUser.create(RankersFaker.fakeDto())
  }

  static fakeDto(baseDto?: Partial<RankingUserDto>): RankingUserDto {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      slug: faker.lorem.slug(),
      xp: faker.number.int({ max: 100 }),
      avatar: {
        image: `${faker.image.avatar()}.jpg`,
        name: faker.person.firstName(),
      },
      tierId: faker.string.uuid(),
      position: 1,
      ...baseDto,
    }
  }

  static fakeManyDto(
    count?: number,
    baseDto?: Partial<RankingUserDto>,
  ): RankingUserDto[] {
    return Array.from({ length: count ?? 10 }).map(() => RankersFaker.fakeDto(baseDto))
  }

  static fakeMany(count?: number): RankingUser[] {
    return Array.from({ length: count ?? 10 }).map(() => RankersFaker.fake())
  }
}
