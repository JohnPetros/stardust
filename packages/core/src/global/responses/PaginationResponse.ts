export class PaginationResponse<PaginationItem> {
  readonly items: PaginationItem[]
  readonly totalItemsCount: number
  readonly itemsPerPage: number
  readonly totalPagesCount: number

  constructor(items: PaginationItem[], totalItemsCount: number, itemsPerPage = 10) {
    this.items = items
    this.totalItemsCount = totalItemsCount
    this.itemsPerPage = itemsPerPage
    this.totalPagesCount = Math.ceil(totalItemsCount / itemsPerPage)
  }
}
