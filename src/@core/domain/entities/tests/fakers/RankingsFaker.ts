import { faker } from '@faker-js/faker'
import { Ranking } from '../../Ranking'
import type { RankingDTO } from '@/@core/dtos'

export class RankingsFaker {
  static fake(baseDTO?: Partial<RankingDTO>): Ranking {
    return Ranking.create({
      id: faker.string.uuid(),
      name: faker.person.firstName(),
      image: faker.image.avatar(),
      position: faker.number.int({ min: 1, max: 100 }),
      reward: faker.number.int({ max: 100 }),
      ...baseDTO,
    })
  }

  static fakeMany(count?: number): Ranking[] {
    return Array.from({ length: count ?? 10 }).map(() => RankingsFaker.fake())
  }
}
