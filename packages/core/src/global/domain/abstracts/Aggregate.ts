import { EntityNotDefinedError } from '../errors'
import { Logical } from '../structures'
import { Entity } from './Entity'

type Props<AggregateEntity> = {
  entity?: AggregateEntity
}

export abstract class Aggregate<AggregateEntity> extends Entity<Props<AggregateEntity>> {
  constructor(
    readonly entityName: string,
    id: string,
    entity?: AggregateEntity,
  ) {
    super({ entity }, id)
  }

  protected get entity(): AggregateEntity {
    if (!this.props.entity) {
      throw new EntityNotDefinedError(this.entityName)
    }
    return this.props.entity
  }

  protected get hasEntity(): Logical {
    return Logical.create(this.props.entity !== undefined)
  }
}

Aggregate.name
