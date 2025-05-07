import type { PaginationProps } from '.'

import { Pagination } from '@stardust/core/global/structures'

export function usePagination({
  totalItemsCount,
  itemsPerPage,
  page,
  onPageChange,
}: PaginationProps) {
  function handlePageButtonClick(page: number) {
    onPageChange(page)
  }

  return {
    pagination: Pagination.create(page, totalItemsCount, itemsPerPage),
    maxPageButtons: Pagination.MAX_PAGE_BUTTONS,
    handlePageButtonClick,
  }
}
