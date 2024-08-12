import { faker } from '@faker-js/faker'
import { Challenge } from '../../Challenge'
import type { ChallengeDTO } from '@/@core/dtos'

export class ChallengesFaker {
  static fake(baseDTO?: Partial<ChallengeDTO>): Challenge {
    return Challenge.create(ChallengesFaker.fakeDTO(baseDTO))
  }

  static fakeDTO(baseDTO?: Partial<ChallengeDTO>): ChallengeDTO {
    return {
      id: faker.string.uuid(),
      title: faker.person.firstName(),
      difficulty: faker.helpers.arrayElement(['easy', 'medium', 'hard']),
      slug: faker.lorem.slug(),
      code: '',
      ...baseDTO,
    }
  }

  static fakeManyDTO(count?: number, baseDTO?: Partial<ChallengeDTO>): ChallengeDTO[] {
    return Array.from({ length: count ?? 10 }).map(
      () => ChallengesFaker.fake(baseDTO).dto
    )
  }
}
