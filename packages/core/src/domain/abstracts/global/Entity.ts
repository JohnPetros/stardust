import { v4 as generateRandomId } from 'uuid'
import { Id } from '@/@core/domain/structs/Id'

export abstract class Entity<Props> {
  private readonly _id: Id
  protected readonly props: Props

  protected constructor(props: Props, id?: string) {
    this._id = id ? Id.create(id) : Id.create(generateRandomId())
    this.props = props 
  }

  isEqualTo(entity: Entity<Props>) {
    return this.id === entity.id
  }

  get id() {
    return this._id.value
  }
}
