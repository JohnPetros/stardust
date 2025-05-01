import { Integer } from './Integer'
import { Logical } from './Logical'

export class Pagination {
  static readonly MAX_PAGE_BUTTONS = 5
  static readonly SINBLING_PAGE_BUTTONS = (Pagination.MAX_PAGE_BUTTONS - 1) / 2
  readonly currentPage: Integer
  readonly totalItems: Integer
  readonly itemsPerPage: Integer

  private constructor(currentPage: Integer, totalItems: Integer, itemsPerPage: Integer) {
    this.currentPage = currentPage
    this.totalItems = totalItems
    this.itemsPerPage = itemsPerPage
  }

  static create(currentPage: number, totalItems: number, itemsPerPage: number) {
    return new Pagination(
      Integer.create(currentPage, 'página atual'),
      Integer.create(totalItems, 'contagem total de itens'),
      Integer.create(itemsPerPage, 'itens por página'),
    )
  }

  get firstPage(): Integer {
    return Integer.create(
      Math.max(this.currentPage.value - Pagination.SINBLING_PAGE_BUTTONS, 1),
    )
  }

  get pagesCount(): Integer {
    return Integer.create(Math.ceil(this.totalItems.value / this.itemsPerPage.value))
  }

  get isFarFromLastPage(): Logical {
    return Logical.create(
      this.currentPage.value + Pagination.SINBLING_PAGE_BUTTONS < this.pagesCount.value,
    )
  }

  get hasPages(): Logical {
    return this.pagesCount.isGreaterThan(Integer.create(0))
  }
}
