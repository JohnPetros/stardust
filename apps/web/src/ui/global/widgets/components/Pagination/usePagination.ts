import type { PaginationProps } from '.'

import { Pagination } from '@stardust/core/global/structs'

export function usePagination({
  totalItemsCount,
  itemsPerPage,
  page,
  onPageChange,
}: PaginationProps) {
  function handlePageButtonCLick(page: number) {
    onPageChange(page)
  }

  return {
    pagination: Pagination.create(page, totalItemsCount, itemsPerPage),
    maxPageButtons: Pagination.MAX_PAGE_BUTTONS,
    handlePageButtonCLick,
  }
}
