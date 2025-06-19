import { Aggregate } from '../abstracts'
import { Author } from '../entities'
import type { AuthorAggregateDto } from './dtos/AuthorAggregateDto'

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
      entity: this.hasEntity.isTrue ? this.entity.dto : undefined,
    }
  }
}
