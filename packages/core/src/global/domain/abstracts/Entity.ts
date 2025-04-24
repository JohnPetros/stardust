import { Id, Logical } from '../structures'

export abstract class Entity<Props = unknown> {
  readonly id: Id
  protected readonly props: Props

  protected constructor(props: Props, id?: string) {
    this.id = Id.create(id)
    this.props = props
  }

  isEqualTo(entity: Entity): Logical {
    return Logical.create(this.id === entity.id)
  }
}
