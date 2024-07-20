import { faker } from '@faker-js/faker'
import type { RankingUserDTO } from '@/@core/dtos'

export class RankingUsersFaker {
  static fakeDTO(baseDTO?: Partial<RankingUserDTO>): RankingUserDTO {
    return {
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      slug: faker.lorem.slug(),
      xp: faker.number.int({ max: 100 }),
      avatarImage: `${faker.image.avatar()}.jpg`,
      tierId: faker.string.uuid(),
      ...baseDTO,
    }
  }

  static fakeManyDTO(
    count?: number,
    baseDTO?: Partial<RankingUserDTO>
  ): RankingUserDTO[] {
    return Array.from({ length: count ?? 10 }).map(() =>
      RankingUsersFaker.fakeDTO(baseDTO)
    )
  }
}
