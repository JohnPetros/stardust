'use client'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

import PageButton from './PageButton'
import { usePagination } from './usePagination'


export interface PaginationProps {
  itemsPerPage: number
  totalItems: number
  offset: number
  setOffset: (offset: number) => void
}

export function Pagination(paginationProps: PaginationProps) {
  const {
    currentPage,
    firstPage,
    totalPages,
    maxPageButtons,
    siblingPageButtons,
    handlePageButtonCLick,
  } = usePagination(paginationProps)

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
      {Array.from({ length: Math.min(maxPageButtons, totalPages) }).map(
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
      {currentPage + siblingPageButtons < totalPages && (
        <PageButton
          isActive={false}
          isVisible={true}
          onClick={() => handlePageButtonCLick(totalPages)}
        >
          ... {totalPages}
        </PageButton>
      )}
      {totalPages > 0 && (
        <PageButton
          isActive={false}
          isVisible={currentPage !== totalPages}
          onClick={() => handlePageButtonCLick(currentPage + 1)}
        >
          <CaretRight className="text-gray-300" />
        </PageButton>
      )}
    </div>
  )
}
