import { Integer } from './Integer'

export class Pagination {
  static readonly MAX_PAGE_BUTTONS = 5
  static readonly SINBLING_PAGE_BUTTONS = (Pagination.MAX_PAGE_BUTTONS - 1) / 2
  readonly offset: Integer
  readonly totalItems: Integer
  readonly itemsPerPage: Integer

  private constructor(offset: Integer, totalItems: Integer, itemsPerPage: Integer) {
    this.offset = offset
    this.totalItems = totalItems
    this.itemsPerPage = itemsPerPage
  }

  static create(offset: number, totalItems: number, itemsPerPage: number) {
    return new Pagination(
      Integer.create('pagination offset', offset),
      Integer.create('pagination total items', totalItems),
      Integer.create('pagination items per page', itemsPerPage)
    )
  }

  calculateNewOffset(page: number) {
    return (page - 1) * this.itemsPerPage.value
  }

  get currentPage() {
    return this.offset.value / this.itemsPerPage.value + 1
  }

  get firstPage() {
    return Math.max(this.currentPage - Pagination.SINBLING_PAGE_BUTTONS, 1)
  }

  get totalPages() {
    return Math.ceil(this.totalItems.value / this.itemsPerPage.value)
  }

  get isFarFromLastPage() {
    return this.currentPage + Pagination.SINBLING_PAGE_BUTTONS < this.totalPages
  }

  get hasPages() {
    return this.totalPages > 0
  }
}
