import { useState, useEffect, type KeyboardEvent } from 'react'

type UsePaginationProps = {
  page: number
  totalPages: number
  totalItemsCount: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export function usePagination({
  page,
  totalPages,
  totalItemsCount,
  itemsPerPage,
  onPageChange,
}: UsePaginationProps) {
  const [pageInput, setPageInput] = useState(String(page))
  const startItem = totalItemsCount > 0 ? (page - 1) * itemsPerPage + 1 : 0
  const endItem = Math.min(page * itemsPerPage, totalItemsCount)

  function handlePageInputChange(value: string) {
    setPageInput(value)
  }

  function handlePageInputSubmit() {
    const pageNumber = Number.parseInt(pageInput, 10)
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber)
    } else {
      setPageInput(String(page))
    }
  }

  function handlePageInputKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      handlePageInputSubmit()
    }
  }

  useEffect(() => {
    setPageInput(String(page))
  }, [page])

  return {
    pageInput,
    startItem,
    endItem,
    handlePageInputChange,
    handlePageInputSubmit,
    handlePageInputKeyDown,
  }
}
