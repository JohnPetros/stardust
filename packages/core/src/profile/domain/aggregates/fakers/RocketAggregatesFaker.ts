import { RocketsFaker } from '#shop/domain/entities/fakers/RocketsFaker'
import type { RocketAggregateDto } from '../dtos'
import { RocketAggregate } from '../RocketAggregate'

export class RocketAggregatesFaker {
  static fake(): RocketAggregate {
    return RocketAggregate.create(RocketAggregatesFaker.fakeDto())
  }

  static fakeDto(): RocketAggregateDto {
    const fakeRocket = RocketsFaker.fake()

    return {
      id: fakeRocket.id.value,
      entity: {
        name: fakeRocket.name.value,
        image: fakeRocket.image.value,
      },
    }
  }
}
