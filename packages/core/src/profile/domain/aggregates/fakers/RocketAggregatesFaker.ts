import type { RocketAggregateDto } from '#profile/dtos'
import { RocketsFaker } from '#shop/entities/fakers'

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
