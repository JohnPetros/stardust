'use client'

import { PageButton } from './PageButton'
import { usePagination } from './usePagination'
import { Icon } from '../Icon'

export type PaginationProps = {
  totalItemsCount: number
  itemsPerPage: number
  page: number
  onPageChange: (offset: number) => void
}

export function Pagination(paginationProps: PaginationProps) {
  const { pagination, maxPageButtons, handlePageButtonCLick } =
    usePagination(paginationProps)

  if (pagination)
    return (
      <div className='flex w-full space-x-3'>
        <PageButton
          isActive={false}
          onClick={() => handlePageButtonCLick(pagination.currentPage - 1)}
          isVisible={pagination.currentPage > 1}
        >
          <Icon name='arrow-left' className='text-gray-300' />
        </PageButton>
        {pagination.firstPage !== 1 && (
          <PageButton
            isActive={false}
            isVisible={true}
            onClick={() => handlePageButtonCLick(1)}
          >
            1 ...
          </PageButton>
        )}
        {Array.from({ length: Math.min(maxPageButtons, pagination.totalPages) }).map(
          (_, index) => {
            const page = index + pagination.firstPage

            if (page <= pagination.totalPages) {
              return (
                <PageButton
                  key={page}
                  isActive={page === pagination.currentPage}
                  isVisible={true}
                  onClick={() => handlePageButtonCLick(page)}
                >
                  {page}
                </PageButton>
              )
            }
            return ''
          },
        )}
        {pagination.isFarFromLastPage && (
          <PageButton
            isActive={false}
            isVisible={true}
            onClick={() => handlePageButtonCLick(pagination.totalPages)}
          >
            ... {pagination.totalPages}
          </PageButton>
        )}
        {pagination.hasPages && (
          <PageButton
            isActive={false}
            isVisible={pagination.currentPage !== pagination.totalPages}
            onClick={() => handlePageButtonCLick(pagination.currentPage + 1)}
          >
            <Icon name='arrow-right' className='text-gray-300' />
          </PageButton>
        )}
      </div>
    )
}
