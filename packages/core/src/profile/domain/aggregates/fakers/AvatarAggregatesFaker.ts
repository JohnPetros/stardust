import { AvatarsFaker } from '#shop/domain/entities/fakers/AvatarsFaker'
import { AvatarAggregate } from '../AvatarAggregate'
import type { AvatarAggregateDto } from '../dtos'

export class AvatarAggregatesFaker {
  static fake(): AvatarAggregate {
    return AvatarAggregate.create(AvatarAggregatesFaker.fakeDto())
  }

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
