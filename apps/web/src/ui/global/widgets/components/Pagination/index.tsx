'use client'

import { PageButton } from './PageButton'
import { usePagination } from './usePagination'
import { Icon } from '../Icon'
import { Integer } from '@stardust/core/global/structures'

export type PaginationProps = {
  totalItemsCount: number
  itemsPerPage: number
  page: number
  onPageChange: (offset: number) => void
}

export const Pagination = (paginationProps: PaginationProps) => {
  const { pagination, maxPageButtons, handlePageButtonCLick } =
    usePagination(paginationProps)

  if (pagination.pagesCount.isGreaterThan(Integer.create(1)).isTrue) {
    return (
      <div className='flex w-full space-x-3'>
        <PageButton
          isActive={false}
          onClick={() => handlePageButtonClick(pagination.currentPage.decrement().value)}
          isVisible={pagination.currentPage.value > 1}
        >
          <Icon name='simple-arrow-left' className='text-gray-300' />
        </PageButton>
        {pagination.firstPage.isEqualTo(Integer.create(1)).isFalse && (
          <PageButton
            isActive={false}
            isVisible={true}
            onClick={() => handlePageButtonCLick(1)}
          >
            1 ...
          </PageButton>
        )}
        {Array.from({
          length: Math.min(maxPageButtons, pagination.pagesCount.value),
        }).map((_, index) => {
          const page = pagination.firstPage.plus(Integer.create(index))

          if (page.isLessOrEqualTo(pagination.pagesCount).isTrue) {
            return (
              <PageButton
                key={page.value}
                isActive={page.isEqualTo(pagination.currentPage).isTrue}
                isVisible={true}
                onClick={() => handlePageButtonCLick(page.value)}
              >
                {page.value}
              </PageButton>
            )
          }
          return ''
        })}
        {pagination.isFarFromLastPage.isTrue && (
          <PageButton
            isActive={false}
            isVisible={true}
            onClick={() => handlePageButtonCLick(pagination.pagesCount.value)}
          >
            ... {pagination.pagesCount.value}
          </PageButton>
        )}
        {pagination.hasPages && (
          <PageButton
            isActive={false}
            isVisible={pagination.currentPage.isEqualTo(pagination.pagesCount).isFalse}
            onClick={() =>
              handlePageButtonCLick(pagination.currentPage.increment().value)
            }
          >
            <Icon name='simple-arrow-right' className='text-gray-300' />
          </PageButton>
        )}
      </div>
    )
  }
}
