export class BaseEntity {
  private readonly _id: string

  constructor(id?: string) {
    this._id = id ?? 'random-id'
  }

  get id() {
    return this._id
  }
}
