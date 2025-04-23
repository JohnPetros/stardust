import { Aggregate } from '#global/abstracts'
import { Image, Name } from '#global/structures'
import type { RocketAggregateDto } from '#profile/dtos'

type RocketAggregateEntity = {
  name: Name
  image: Image
}

export class RocketAggregate extends Aggregate<RocketAggregateEntity> {
  private static readonly ENTITY_NAME = 'Foguete do usuário'
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
      entity: {
        name: this.name.value,
        image: this.image.value,
      },
    }
  }
}
