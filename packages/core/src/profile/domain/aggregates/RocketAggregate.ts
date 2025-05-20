import { Aggregate } from '#global/domain/abstracts/index'
import { Image, Name } from '#global/domain/structures/index'
import type { RocketAggregateDto } from '#profile/domain/aggregates/dtos/index'

type RocketAggregateEntity = {
  name: Name
  image: Image
}

export class RocketAggregate extends Aggregate<RocketAggregateEntity> {
  private static readonly ENTITY_NAME = 'Rocket'

  static create(dto: RocketAggregateDto) {
    if (dto.entity) {
      const entity = {
        name: Name.create(dto.entity.name),
        image: Image.create(dto.entity.image),
      }
      return new RocketAggregate(RocketAggregate.ENTITY_NAME, dto.id, entity)
    }

    return new RocketAggregate(RocketAggregate.ENTITY_NAME, dto.id)
  }

  get name() {
    return this.entity.name
  }

  get image() {
    return this.entity.image
  }

  get dto(): RocketAggregateDto {
    return {
      id: this.id.value,
      entity: this.hasEntity.isTrue
        ? {
            name: this.name.value,
            image: this.image.value,
          }
        : undefined,
    }
  }
}
