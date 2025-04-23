import { Integer } from './Integer'

export class Pagination {
  static readonly MAX_PAGE_BUTTONS = 5
  static readonly SINBLING_PAGE_BUTTONS = (Pagination.MAX_PAGE_BUTTONS - 1) / 2
  readonly currentPage: Integer
  readonly totalItemsCount: Integer
  readonly itemsPerPage: Integer

  private constructor(
    currentPage: Integer,
    totalItemsCount: Integer,
    itemsPerPage: Integer,
  ) {
    this.currentPage = currentPage
    this.totalItemsCount = totalItemsCount
    this.itemsPerPage = itemsPerPage
  }

  static create(currentPage: number, totalItemsCount: number, itemsPerPage: number) {
    return new Pagination(
      Integer.create(currentPage, 'página atual'),
      Integer.create(totalItemsCount, 'contagem total de itens'),
      Integer.create(itemsPerPage, 'itens por página'),
    )
  }

  get firstPage() {
    return Math.max(this.currentPage.value - Pagination.SINBLING_PAGE_BUTTONS, 1)
  }

  get pagesCount() {
    return Math.ceil(this.totalItemsCount.value / this.itemsPerPage.value)
  }

  get isFarFromLastPage() {
    return this.currentPage.value + Pagination.SINBLING_PAGE_BUTTONS < this.pagesCount
  }

  get hasPages() {
    return this.pagesCount > 0
  }
}
