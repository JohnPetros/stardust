import { v4 as generateRandomId } from 'uuid'
import { Id } from '@/@core/domain/structs/Id'

export abstract class BaseEntity {
  private readonly _id: Id

  constructor(id?: string) {
    this._id = id ? Id.create(id) : Id.create(generateRandomId())
  }

  get id() {
    return this._id.value
  }
}
