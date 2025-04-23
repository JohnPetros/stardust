import { Aggregate } from '#global/abstracts'
import { Image, Integer, Name, OrdinalNumber } from '#global/structures'
import type { TierAggregateDto } from '#profile/dtos'

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

  get dto(): TierAggregateDto {
    return {
      id: this.id.value,
      entity: {
        name: this.name.value,
        image: this.image.value,
        position: this.entity.position.value,
        reward: this.entity.reward.value,
      },
    }
  }
}
