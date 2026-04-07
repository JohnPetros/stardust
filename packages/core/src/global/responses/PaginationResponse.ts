export class PaginationResponse<PaginationItem> {
  readonly items: PaginationItem[]
  readonly totalItemsCount: number
  readonly page: number
  readonly itemsPerPage: number
  readonly totalPagesCount: number

  constructor({
    items,
    totalItemsCount,
    itemsPerPage = 10,
    page = 1,
  }: {
    items: PaginationItem[]
    totalItemsCount: number
    itemsPerPage?: number
    page?: number
  }) {
    this.page = page
    this.items = items
    this.totalItemsCount = totalItemsCount
    this.itemsPerPage = itemsPerPage
    this.totalPagesCount = Math.ceil(totalItemsCount / itemsPerPage)
  }
}
