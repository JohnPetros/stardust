import { Integer } from './Integer'

export class Pagination {
  static readonly ITEMS_PER_PAGE = 6
  static readonly MAX_PAGE_BUTTONS = 5
  static readonly SINBLING_PAGE_BUTTONS = (Pagination.MAX_PAGE_BUTTONS - 1) / 2
  readonly offset: Integer
  readonly totalItems: Integer

  private constructor(offset: Integer, totalItems: Integer) {
    this.offset = offset
    this.totalItems = totalItems
  }

  static create(offset: number, totalItems: number) {
    return new Pagination(
      Integer.create('pagination offset', offset),
      Integer.create('pagination total items', totalItems)
    )
  }

  static calculateLimit(offset: number) {
    return offset + Pagination.ITEMS_PER_PAGE - 1
  }

  calculateNewOffset(page: number) {
    return (page - 1) * Pagination.ITEMS_PER_PAGE
  }

  get currentPage() {
    return this.offset.value / Pagination.ITEMS_PER_PAGE + 1
  }

  get firstPage() {
    return Math.max(this.currentPage - Pagination.SINBLING_PAGE_BUTTONS, 1)
  }

  get totalPages() {
    return Math.ceil(this.totalItems.value / Pagination.ITEMS_PER_PAGE)
  }

  get isFarFromLastPage() {
    return this.currentPage + Pagination.SINBLING_PAGE_BUTTONS < this.totalPages
  }

  get hasPages() {
    return this.totalPages > 0
  }
}
