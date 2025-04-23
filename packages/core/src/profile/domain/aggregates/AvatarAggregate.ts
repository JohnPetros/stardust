import { Aggregate } from '#global/abstracts'
import { Image, Name } from '#global/structures'
import type { AvatarAggregateDto } from '#profile/dtos'

type AvatarAggregateEntity = {
  name: Name
  image: Image
}

export class AvatarAggregate extends Aggregate<AvatarAggregateEntity> {
  private static readonly ENTITY_NAME = 'Avatar de usuário'

  static create(dto: AvatarAggregateDto) {
    if (dto.entity) {
      const entity = {
        name: Name.create(dto.entity.name),
        image: Image.create(dto.entity.image),
      }
      return new AvatarAggregate(AvatarAggregate.ENTITY_NAME, dto.id, entity)
    }

    return new AvatarAggregate(AvatarAggregate.ENTITY_NAME, dto.id)
  }

  get name() {
    return this.entity.name
  }

  get image() {
    return this.entity.image
  }

  get dto(): AvatarAggregateDto {
    return {
      id: this.id.value,
      entity: {
        name: this.name.value,
        image: this.image.value,
      },
    }
  }
}
