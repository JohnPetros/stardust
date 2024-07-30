export class ShuffledList<Item> {
  private constructor(readonly items: Item[]) {}

  static create<Item>(items: Item[]) {
    const originalItems = [...items]
    const shuffledItems = originalItems.sort(() => {
      return Math.random() - 0.5
    })

    return new ShuffledList(shuffledItems)
  }
}
