import { Id } from '#global/structs'

export abstract class Entity<Props> {
  private readonly _id: Id
  protected readonly props: Props

  protected constructor(props: Props, id?: string) {
    this._id = Id.create(id)
    this.props = props
  }

  isEqualTo(entity: Entity<Props>) {
    return this.id === entity.id
  }

  get id() {
    return this._id.value
  }
}
