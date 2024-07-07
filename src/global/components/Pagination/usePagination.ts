import { PaginationProps } from '.'

import { calculatePage } from '@/modules/global/utils'

const MAX_PAGE_BUTTONS = 5
const SINBLING_PAGE_BUTTONS = (MAX_PAGE_BUTTONS - 1) / 2

export function usePagination({
  totalItems,
  itemsPerPage,
  offset,
  setOffset,
}: PaginationProps) {
  const currentPage = calculatePage(offset, itemsPerPage)
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const firstPage = Math.max(currentPage - SINBLING_PAGE_BUTTONS, 1)

  function handlePageButtonCLick(page: number) {
    const newOffset = (page - 1) * itemsPerPage
    setOffset(newOffset)
  }

  return {
    currentPage,
    totalPages,
    firstPage,
    maxPageButtons: MAX_PAGE_BUTTONS,
    siblingPageButtons: SINBLING_PAGE_BUTTONS,
    handlePageButtonCLick,
  }
}
