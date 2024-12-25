import { IdFaker } from '#fakers/structs'
import type { StarRewardingPayloadDto } from '#lesson/dtos'
import { faker } from '@faker-js/faker'

export class StarRewardingPayloadFaker {
  static fakeDto(baseDto?: Partial<StarRewardingPayloadDto>): StarRewardingPayloadDto {
    return {
      origin: 'star',
      questionsCount: faker.number.int({ min: 5, max: 10 }),
      incorrectAnswersCount: faker.number.int({ min: 1, max: 5 }),
      secondsCount: faker.number.int({ min: 1, max: 60 }),
      starId: IdFaker.fake().value,
      ...baseDto,
    }
  }
}
