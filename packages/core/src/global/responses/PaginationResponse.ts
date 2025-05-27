export class PaginationResponse<Item> {
  readonly items: Item[]
  readonly totalItemsCount: number
  readonly itemsPerPage: number
  readonly pagesCount: number

  constructor(items: Item[], totalItemsCount: number, itemsPerPage = 10) {
    this.items = items
    this.totalItemsCount = totalItemsCount
    this.itemsPerPage = itemsPerPage
    this.pagesCount = Math.ceil(totalItemsCount / itemsPerPage)
  }
}
