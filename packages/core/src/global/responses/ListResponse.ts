export class ListResponse<Item> {
  readonly items: Item[]

  constructor({
    items,
  }: {
    items: Item[]
  }) {
    this.items = items
  }
}
