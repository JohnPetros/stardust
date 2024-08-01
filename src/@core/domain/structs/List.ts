import { Logical } from './Logical'

export class List<Item> {
  private constructor(readonly items: Item[] = []) {}

  static create<Item>(items: Item[]) {
    return new List<Item>(items)
  }

  add(item: Item) {
    this.items.push(item)
  }

  remove(item: Item) {
    const items = this.items.filter((currentItem) => currentItem !== item)
    return new List(items)
  }

  isEqualTo(otherList: List<Item>) {
    let isTrue = true

    if (this.length !== otherList.length) {
      isTrue = false
    }

    if (isTrue)
      for (let index = 0; index < this.items.length; index++) {
        if (this.items[index] !== otherList.items[index]) {
          isTrue = false
        }
      }

    return Logical.create(`Is ${this.items} equal to ${otherList.items}?`, isTrue)
  }

  includesList(otherList: List<Item>): Logical {
    let verification = false

    verification = otherList.items.every((item) => {
      return this.items.includes(item)
    })

    return Logical.create('includes other list?', verification)
  }

  includes(item: Item): Logical {
    return Logical.create(`Is ${this.items} includes ${item}?`, this.items.includes(item))
  }

  get length() {
    return this.items.length
  }

  get lengthTruthy() {
    return this.items.filter((item) => !!item).length
  }
}
