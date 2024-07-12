import { Id } from '../structs'

export abstract class BaseEntity {
  private readonly _id: Id

  constructor(id?: string) {
    this._id = id ? Id.create(id) : Id.create('random-id')
  }

  get id() {
    return this._id.value
  }
}
