import { faker } from '@faker-js/faker'
import type { RankingUserDto } from '#dtos'

export class RankingUsersFaker {
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
      ...baseDto,
    }
  }

  static fakeManyDto(
    count?: number,
    baseDto?: Partial<RankingUserDto>,
  ): RankingUserDto[] {
    return Array.from({ length: count ?? 10 }).map(() =>
      RankingUsersFaker.fakeDto(baseDto),
    )
  }
}
