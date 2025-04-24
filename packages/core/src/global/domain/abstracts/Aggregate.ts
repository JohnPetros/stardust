import { EntityNotDefinedError } from '#global/errors'
import { Logical } from '#global/structures'
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

  get entity(): AggregateEntity {
    if (!this.props.entity) {
      throw new EntityNotDefinedError(this.entityName)
    }
    return this.props.entity
  }

  isEntityEqualTo(entity: Entity): Logical {
    return Logical.create(this.id === entity.id)
  }
}

Aggregate.name
