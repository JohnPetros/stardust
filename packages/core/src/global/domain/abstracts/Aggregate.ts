import { EntityNotDefinedError } from '#global/errors'
import { Entity } from './Entity'

type AggregateProps<AggregateEntity> = {
  entity?: AggregateEntity
}

export abstract class Aggregate<AggregateEntity> extends Entity<
  AggregateProps<AggregateEntity>
> {
  constructor(
    readonly entityName: string,
    id: string,
    entity?: AggregateEntity,
  ) {
    super({ entity }, id)
  }

  get entity(): AggregateEntity {
    if (!this.props.entity) {
      throw new EntityNotDefinedError(this.entityName)
    }
    return this.props.entity
  }
}
