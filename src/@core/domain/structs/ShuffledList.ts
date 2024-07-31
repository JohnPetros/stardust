import { Collection } from './Collection'

export class ShuffledList<Item> {
  private constructor(readonly items: Item[]) {}

  static create<Item>(items: Item[]) {
    const originalItems = [...items]
    let shuffledItems = [...originalItems]

    originalItems.sort(() => {
      return Math.random() - 0.5
    })

    while (
      Collection.create(originalItems).isEqualTo(Collection.create(shuffledItems)).isTrue
    ) {
      originalItems.sort(() => {
        return Math.random() - 0.5
      })
    }

    shuffledItems = originalItems

    return new ShuffledList(shuffledItems)
  }
}
