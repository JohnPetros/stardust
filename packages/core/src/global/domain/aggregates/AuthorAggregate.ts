import { Aggregate } from '#global/abstracts'
import type { AuthorAggregateDto } from '#global/dtos'
import { Author } from '#global/entities'

export class AuthorAggregate extends Aggregate<Author> {
  private static readonly ENTITY_NAME = 'Autor'

  static create(dto: AuthorAggregateDto) {
    if (dto.entity) {
      const entity = Author.create(dto.entity)
      return new AuthorAggregate(AuthorAggregate.ENTITY_NAME, dto.id, entity)
    }

    return new AuthorAggregate(AuthorAggregate.ENTITY_NAME, dto.id)
  }

  get name() {
    return this.entity.name
  }

  get slug() {
    return this.entity.slug
  }

  get avatar() {
    return this.entity.avatar
  }

  get dto(): AuthorAggregateDto {
    return {
      id: this.id.value,
      entity: this.entity?.dto,
    }
  }
}
