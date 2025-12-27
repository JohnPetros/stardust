export class CursorResponse<Item> {
  readonly items: Item[]
  readonly nextCursor: Date | null

  constructor(items: Item[], nextCursor: Date | null) {
    this.items = items
    this.nextCursor = nextCursor
  }
}
