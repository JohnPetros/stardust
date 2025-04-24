import { Aggregate } from '#global/abstracts'
import { Image, Name } from '#global/structs'
import type { TierAggregateDto } from '#profile/dtos'

type TierAggregateEntity = {
  name: Name
  image: Image
}

export class TierAggregate extends Aggregate<TierAggregateEntity> {
  private static readonly ENTITY_NAME = 'Tier de usuário'
  static create(dto: TierAggregateDto) {
    if (dto.entity) {
      const entity = {
        name: Name.create(dto.entity.name),
        image: Image.create(dto.entity.image),
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
      id: this.id,
      entity: {
        name: this.name.value,
        image: this.image.value,
      },
    }
  }
}
