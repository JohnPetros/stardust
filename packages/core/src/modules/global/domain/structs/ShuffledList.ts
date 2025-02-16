import { List } from './List'

export class ShuffledList<Item> {
  private constructor(readonly items: Item[]) {}

  static create<Item>(items: Item[]) {
    const originalItems = [...items]
    let shuffledItems = [...originalItems]

    originalItems.sort(() => {
      return Math.random() - 0.5
    })

    while (List.create(originalItems).isStrictlyEqualTo(List.create(shuffledItems)).isTrue) {
      originalItems.sort(() => {
        return Math.random() - 0.5
      })
    }

    shuffledItems = originalItems

    return new ShuffledList(shuffledItems)
  }
}
