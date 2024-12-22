import { useEffect, useState } from 'react'
import type { PaginationProps } from '.'

import { Pagination } from '@stardust/core/global/structs'

export function usePagination({
  totalItems,
  itemsPerPage,
  offset,
  setOffset,
}: PaginationProps) {
  const [pagination, setPagination] = useState<Pagination | null>(null)

  function handlePageButtonCLick(page: number) {
    if (!pagination) return

    const newOffset = pagination.calculateNewOffset(page)
    setOffset(newOffset)
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
