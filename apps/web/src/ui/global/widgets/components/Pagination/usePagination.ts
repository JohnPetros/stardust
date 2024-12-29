import { useEffect, useState } from 'react'
import type { PaginationProps } from '.'

import { Pagination } from '@stardust/core/global/structs'

export function usePagination({
  totalItemsCount,
  itemsPerPage,
  page,
  onPageChange,
}: PaginationProps) {
  const [pagination, setPagination] = useState<Pagination | null>(null)

  function handlePageButtonCLick(page: number) {
    onPageChange(page)
  }

  useEffect(() => {
    setPagination(Pagination.create(offset, totalItems, itemsPerPage))
  }, [offset, totalItems, itemsPerPage])

  return {
    pagination,
    maxPageButtons: Pagination.MAX_PAGE_BUTTONS,
    handlePageButtonCLick,
  }
}
