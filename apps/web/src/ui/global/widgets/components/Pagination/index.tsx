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
          onClick={() =>
            handlePageButtonCLick(pagination.currentPage.dencrement(1).value)
          }
          isVisible={pagination.currentPage.value > 1}
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
        {Array.from({ length: Math.min(maxPageButtons, pagination.pagesCount) }).map(
          (_, index) => {
            const page = index + pagination.firstPage

            if (page <= pagination.pagesCount) {
              return (
                <PageButton
                  key={page}
                  isActive={page === pagination.currentPage.value}
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
            onClick={() => handlePageButtonCLick(pagination.pagesCount)}
          >
            ... {pagination.pagesCount}
          </PageButton>
        )}
        {pagination.hasPages && (
          <PageButton
            isActive={false}
            isVisible={pagination.currentPage.value !== pagination.pagesCount}
            onClick={() =>
              handlePageButtonCLick(pagination.currentPage.increment(1).value)
            }
          >
            <Icon name='arrow-right' className='text-gray-300' />
          </PageButton>
        )}
      </div>
    )
}
