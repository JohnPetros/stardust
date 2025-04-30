import { Pagination } from '../Pagination'

describe('Pagination structure', () => {
  it('should be created with current page, total items count and items per page', () => {
    const currentPage = 1
    const totalItems = 10
    const itemsPerPage = 5
    const pagination = Pagination.create(currentPage, totalItems, itemsPerPage)
    expect(pagination.currentPage.value).toBe(currentPage)
    expect(pagination.itemsPerPage.value).toBe(totalItems)
    expect(pagination.itemsPerPage.value).toBe(itemsPerPage)
  })

  it('should return true if it has any page, false otherwise', () => {
    let pagination = Pagination.create(1, 10, 5)
    expect(pagination.hasPages.isTrue).toBeTruthy()

    pagination = Pagination.create(1, 0, 1)
    expect(pagination.hasPages.isFalse).toBeTruthy()
  })

  it('should return the first page keeping the maximum number of sibling page buttons given the current page', () => {
    expect(Pagination.create(1, 1, 1).firstPage.value).toBe(1)
    expect(Pagination.create(12, 1, 1).firstPage.value).toBe(10)
    expect(Pagination.create(20, 1, 1).firstPage.value).toBe(18)
    expect(Pagination.create(100, 1, 1).firstPage.value).toBe(98)
  })

  it('should count the pages based on total items and items per page', () => {
    expect(Pagination.create(1, 10, 2).pagesCount.value).toBe(5)
    expect(Pagination.create(1, 7, 3).pagesCount.value).toBe(3)
    expect(Pagination.create(1, 5, 3).pagesCount.value).toBe(2)
    expect(Pagination.create(1, 9, 3).pagesCount.value).toBe(3)
    expect(Pagination.create(1, 3, 10).pagesCount.value).toBe(1)
    expect(Pagination.create(1, 0, 10).pagesCount.value).toBe(0)
    expect(Pagination.create(1, 4, 1).pagesCount.value).toBe(4)
    expect(Pagination.create(1, 1, 1).pagesCount.value).toBe(1)
    expect(Pagination.create(1, 10, 10).pagesCount.value).toBe(1)
    expect(Pagination.create(1, 1000, 100).pagesCount.value).toBe(10)
  })
})
