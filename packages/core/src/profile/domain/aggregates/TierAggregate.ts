import { Aggregate } from '#global/domain/abstracts/index'
import { Image, Integer, Name, OrdinalNumber } from '#global/domain/structures/index'
import type { TierAggregateDto } from '#profile/domain/aggregates/dtos/index'

type TierAggregateEntity = {
  name: Name
  image: Image
  position: OrdinalNumber
  reward: Integer
}

export class TierAggregate extends Aggregate<TierAggregateEntity> {
  private static readonly ENTITY_NAME = 'Tier do usuário'

  static create(dto: TierAggregateDto) {
    if (dto.entity) {
      const entity = {
        name: Name.create(dto.entity.name),
        image: Image.create(dto.entity.image),
        position: OrdinalNumber.create(dto.entity.position, 'Posição do tier'),
        reward: Integer.create(dto.entity.reward, 'Recompensa do tier'),
      }
      return new TierAggregate(TierAggregate.ENTITY_NAME, dto.id, entity)
    }

    return new TierAggregate(TierAggregate.ENTITY_NAME, dto.id)
  }

  get name() {
    return this.entity.name
  }

  get image() {
    return this.entity.image
  }

  get reward() {
    return this.entity.reward
  }

  get position() {
    return this.entity.position
  }

  get dto(): TierAggregateDto {
    return {
      id: this.id.value,
      entity: {
        name: this.name.value,
        image: this.image.value,
        position: this.entity.position.number.value,
        reward: this.entity.reward.value,
      },
    }
  }
}
