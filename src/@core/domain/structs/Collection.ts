import { Logical } from './Logical'

export class Collection<Item> {
  private constructor(readonly items: Item[] = []) {}

  static create<Item>(items: Item[]) {
    return new Collection<Item>(items)
  }

  isEqualTo(collection: Collection<Item>) {
    let isTrue = true

    for (let index = 0; index < this.items.length; index++) {
      if (this.items[index] !== collection.items[index]) {
        isTrue = false
      }
    }

    return Logical.create('is collection equal to?', isTrue)
  }

  get length() {
    return this.items.filter((item) => !!item).length
  }
}
