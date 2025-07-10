import { TiersFaker } from '#ranking/domain/entities/fakers/TiersFaker'
import type { TierAggregateDto } from '../dtos'
import { TierAggregate } from '../TierAggregate'

export class TierAggregatesFaker {
  static fake(): TierAggregate {
    return TierAggregate.create(TierAggregatesFaker.fakeDto())
  }

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
