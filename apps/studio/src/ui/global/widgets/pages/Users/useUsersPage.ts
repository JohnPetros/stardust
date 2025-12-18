import { useState, useCallback, useMemo } from 'react'
import { useRest } from '@/ui/global/hooks/useRest'
import { useCache } from '@/ui/global/hooks/useCache'
import { useDebounce } from '@/ui/global/hooks/useDebounce'
import { CACHE } from '@/constants'

export const useUsersPage = () => {
  const { profileService } = useRest()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  const { data, isLoading, refetch } = useCache({
    key: CACHE.usersTable.key,
    dependencies: [debouncedSearch, page],
    fetcher: async () =>
      await profileService.fetchUsersList({
        search: debouncedSearch,
        page,
        itemsPerPage,
      }),
  })

  const totalPages = useMemo(() => {
    if (!data?.totalItemsCount) return 0
    return Math.ceil(data.totalItemsCount / itemsPerPage)
  }, [data?.totalItemsCount])

  const handleNextPage = useCallback(() => {
    if (page < totalPages) setPage((prev) => prev + 1)
  }, [page, totalPages])

  const handlePrevPage = useCallback(() => {
    if (page > 1) setPage((prev) => prev - 1)
  }, [page])

  const handleSearchChange = useCallback((value: string) => {
    setSearch(value)
    setPage(1)
  }, [])

  return {
    users: data?.items ?? [],
    isLoading,
    totalItemsCount: data?.totalItemsCount ?? 0,
    totalPages,
    page,
    itemsPerPage,
    handleNextPage,
    handlePrevPage,
    handleSearchChange,
    refetch,
  }
}
