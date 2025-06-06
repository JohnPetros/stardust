import { Id } from './Id'
import { Integer } from './Integer'
import { Logical } from './Logical'

export class IdsList {
  private constructor(readonly ids: Id[]) {}

  static create(ids?: string[]): IdsList {
    return new IdsList(ids ? ids.map(Id.create) : [])
  }

  includes(id: Id): Logical {
    return Logical.create(this.ids.some((currentId) => id.value === currentId.value))
  }

  add(id: Id): IdsList {
    return new IdsList([...this.ids, id])
  }

  remove(id: Id): IdsList {
    const ids = this.ids.filter((currentId) => currentId.value !== id.value)
    return new IdsList(ids)
  }

  get count(): Integer {
    return Integer.create(this.ids.length)
  }

  get dto() {
    return this.ids.map((id) => id.value)
  }

  get isEmpty(): Logical {
    return Logical.create(this.ids.length === 0)
  }
}
