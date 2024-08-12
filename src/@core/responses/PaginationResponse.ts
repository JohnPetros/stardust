export class PaginationResponse<Item> {
  constructor(
    readonly items: Item[],
    readonly count: number | null
  ) {}
}
