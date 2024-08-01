import { faker } from '@faker-js/faker'
import type { StarRewardingPayloadDTO } from '@/@core/dtos'
import { IdFaker } from './IdsFaker'

export class StarRewardingPayloadFaker {
  static fakeDTO(baseDTO?: Partial<StarRewardingPayloadDTO>): StarRewardingPayloadDTO {
    return {
      origin: 'star',
      questionsCount: faker.number.int({ min: 5, max: 10 }),
      incorrectAnswersCount: faker.number.int({ min: 1, max: 5 }),
      secondsCount: faker.number.int({ min: 1, max: 60 }),
      starId: IdFaker.fake().value,
      ...baseDTO,
    }
  }
}
