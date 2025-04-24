import type { AvatarAggregateDto } from '#profile/dtos'
import { AvatarsFaker } from '#shop/entities/fakers'

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
