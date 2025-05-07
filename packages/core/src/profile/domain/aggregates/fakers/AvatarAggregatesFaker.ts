import { AvatarsFaker } from '#shop/domain/entities/fakers/AvatarsFaker'
import type { AvatarAggregateDto } from '../dtos'

export class AvatarAggregatesFaker {
  static fakeDto(): AvatarAggregateDto {
    const fakeAvatar = AvatarsFaker.fake()

    return {
      id: fakeAvatar.id.value,
      entity: {
        name: fakeAvatar.name.value,
        image: fakeAvatar.image.value,
      },
    }
  }
}
