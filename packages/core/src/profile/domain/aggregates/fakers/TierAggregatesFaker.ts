import { TiersFaker } from '@/ranking/domain/entities/fakers'
import type { TierAggregateDto } from '../dtos'

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
