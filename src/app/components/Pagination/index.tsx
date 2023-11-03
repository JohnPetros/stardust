'use client'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

import PageButton from './PageButton'

import { calculatePage } from '@/utils/helpers'

interface PaginationProps {
  itemsPerPage: number
  totalItems: number
  offset: number
  setOffset: (offset: number) => void
}

const MAX_PAGE_BUTTONS = 7
const SINBLING_PAGE_BUTTONS = (MAX_PAGE_BUTTONS - 1) / 2

export function Pagination({
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
    console.log(newOffset)
    setOffset(newOffset)
  }

  return (
    <div className="flex w-full space-x-3">
      <PageButton
        isActive={false}
        onClick={() => handlePageButtonCLick(currentPage - 1)}
        isVisible={currentPage > 1}
      >
        <CaretLeft className="text-gray-300" />
      </PageButton>

      {firstPage !== 1 && (
        <PageButton
          isActive={false}
          isVisible={true}
          onClick={() => handlePageButtonCLick(1)}
        >
          1 ...
        </PageButton>
      )}

      {Array.from({ length: Math.min(MAX_PAGE_BUTTONS, totalPages) }).map(
        (_, index) => {
          const page = index + firstPage

          if (page <= totalPages) {
            return (
              <PageButton
                key={page}
                isActive={page === currentPage}
                isVisible={true}
                onClick={() => handlePageButtonCLick(page)}
              >
                {page}
              </PageButton>
            )
          }
          return ''
        }
      )}

      {currentPage + SINBLING_PAGE_BUTTONS < totalPages && (
        <PageButton
          isActive={false}
          isVisible={true}
          onClick={() => handlePageButtonCLick(totalPages)}
        >
          ... {totalPages}
        </PageButton>
      )}

      <PageButton
        isActive={false}
        isVisible={currentPage !== totalPages}
        onClick={() => handlePageButtonCLick(currentPage + 1)}
      >
        <CaretRight className="text-gray-300" />
      </PageButton>
    </div>
  )
}
