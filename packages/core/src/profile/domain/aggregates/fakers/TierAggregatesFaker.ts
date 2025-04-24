import type { TierAggregateDto } from '#profile/dtos'
import { TiersFaker } from '#ranking/entities/fakers'

export class TierAggregatesFaker {
  static fakeDto(baseDto?: Partial<TierAggregateDto>): TierAggregateDto {
    const fakeTier = TiersFaker.fakeDto()

    return {
      id: String(fakeTier.id),
      entity: {
        name: fakeTier.name,
        image: fakeTier.image,
        position: fakeTier.position,
        reward: fakeTier.reward,
      },
      ...baseDto,
    }
  }
}
