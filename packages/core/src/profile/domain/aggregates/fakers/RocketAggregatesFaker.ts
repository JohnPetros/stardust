import { RocketsFaker } from '#shop/domain/entities/fakers/RocketsFaker'
import type { RocketAggregateDto } from '../dtos'

export class RocketAggregatesFaker {
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
