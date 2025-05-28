export class PaginationResponse<Item> {
  readonly items: Item[]
  readonly totalItemsCount: number
  readonly itemsPerPage: number
  readonly totalPagesCount: number

  constructor(items: Item[], totalItemsCount: number, itemsPerPage = 10) {
    this.items = items
    this.totalItemsCount = totalItemsCount
    this.itemsPerPage = itemsPerPage
    this.totalPagesCount = Math.ceil(totalItemsCount / itemsPerPage)
  }
}
