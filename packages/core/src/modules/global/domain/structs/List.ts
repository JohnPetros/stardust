import { AppError } from '#global/errors'
import { Logical } from './Logical'

export class List<Item> {
  private constructor(readonly items: Item[] = []) {}

  static create<Item>(items: Item[]) {
    return new List<Item>(items)
  }

  add(item: Item) {
    this.items.push(item)
    return new List(this.items)
  }

  remove(item: Item) {
    const items = this.items.filter((currentItem) => currentItem !== item)
    return new List(items)
  }

  swap(item1: Item, item2: Item) {
    const item1Index = this.items.indexOf(item1)
    const item2Index = this.items.indexOf(item2)

    const items = [...this.items]

    if (!items[item2Index]) return new List(items)
    items[item1Index] = items[item2Index]

    const firstItem = items[item1Index]
    if (!firstItem) return new List(items)
    items[item2Index] = firstItem

    return new List(items)
  }

  makeEmpty() {
    return new List([])
  }

  getByIndex<Fallback>(index: number, fallback: Fallback): Item | Fallback {
    const item = this.items[index]
    return item ?? fallback
  }

  isEmpty() {
    return Logical.create(this.items.length === 0)
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

    return Logical.create(isTrue)
  }

  includesList(otherList: List<Item>): Logical {
    let verification = false

    verification = otherList.items.every((item) => {
      return this.items.includes(item)
    })

    return Logical.create(verification)
  }

  includes(item: Item): Logical {
    return Logical.create(this.items.includes(item))
  }

  hasAllEqualTo(value: unknown) {
    return Logical.create(this.items.every((item) => item === value))
  }

  get random() {
    const randomItem = this.items[Math.floor(Math.random() * this.items.length)]
    if (!randomItem)
      throw new AppError(
        `Erro ao pegar um item aleatória da lista: ${this.items.join(', ')}`,
      )

    return randomItem
  }

  get length() {
    return this.items.length
  }

  get lengthTruthy() {
    return this.items.filter((item) => !!item).length
  }

  get hasItems() {
    return Logical.create(this.length > 0)
  }
}
