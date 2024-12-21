import { faker } from '@faker-js/faker'
import { IdFaker } from '../../../../../modules/global/domain/structs/tests/fakers/IdsFaker'
import type { StarRewardingPayloadDto } from '../../../#dtos/lesson/StarRewardingPayloadDto'

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
