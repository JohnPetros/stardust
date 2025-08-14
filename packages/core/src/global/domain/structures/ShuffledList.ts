import { List } from './List'

export class ShuffledList<Item> {
  private constructor(readonly items: Item[]) {}

  static create<Item>(items: Item[], shouldShuffle: boolean = true) {
    if (items.length === 0) {
      return new ShuffledList([])
    }

    if (!shouldShuffle) {
      return new ShuffledList(items)
    }

    const originalItems = [...items]
    let shuffledItems = [...originalItems]

    originalItems.sort(() => {
      return Math.random() - 0.5
    })

    while (
      List.create(originalItems).isStrictlyEqualTo(List.create(shuffledItems)).isTrue
    ) {
      originalItems.sort(() => {
        return Math.random() - 0.5
      })
    }

    shuffledItems = originalItems

    return new ShuffledList(shuffledItems)
  }

  add(item: Item) {
    this.items.push(item)
    return ShuffledList.create(this.items, false)
  }

  remove(itemIndex: number) {
    const items = this.items.filter((_, index) => index !== itemIndex)
    return ShuffledList.create(items, false)
  }

  change(itemIndex: number, item: Item) {
    const items = this.items.map((currentItem, index) =>
      index === itemIndex ? item : currentItem,
    )
    return ShuffledList.create(items, false)
  }
}
