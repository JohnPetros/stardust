import { Aggregate } from '#global/domain/abstracts/index'
import { Name, Slug } from '#global/domain/structures/index'
import type { GalaxyAggregateDto } from '#profile/domain/aggregates/dtos/index'

type GalaxyAggregateEntity = {
  name: Name
  slug: Slug
}

export class GalaxyAggregate extends Aggregate<GalaxyAggregateEntity> {
  private static readonly ENTITY_NAME = 'Galaxy'

  static create(dto: GalaxyAggregateDto) {
    if (dto.entity) {
      const entity = {
        name: Name.create(dto.entity.name),
        slug: Slug.create(dto.entity.slug),
      }
      return new GalaxyAggregate(GalaxyAggregate.ENTITY_NAME, dto.id, entity)
    }

    return new GalaxyAggregate(GalaxyAggregate.ENTITY_NAME, dto.id)
  }

  get name() {
    return this.entity.name
  }

  get slug() {
    return this.entity.slug
  }

  get dto(): GalaxyAggregateDto {
    return {
      id: this.id.value,
      entity: this.hasEntity.isTrue
        ? {
            name: this.name.value,
            slug: this.slug.value,
          }
        : undefined,
    }
  }
}
