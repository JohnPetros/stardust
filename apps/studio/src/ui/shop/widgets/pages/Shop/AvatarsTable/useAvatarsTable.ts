import { useState, useMemo } from 'react'
import { useDebounceValue } from 'usehooks-ts'

import type { ShopService } from '@stardust/core/shop/interfaces'
import { ListingOrder, OrdinalNumber, Text } from '@stardust/core/global/structures'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'

const ITEMS_PER_PAGE = OrdinalNumber.create(10)

type Params = {
  shopService: ShopService
}

export function useAvatarsTable({ shopService }: Params) {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch] = useDebounceValue(searchInput, 500)
  const [order, setOrder] = useState<ListingOrder>(ListingOrder.createAsAscending())
  const [page, setPage] = useState(1)

  const search = useMemo(() => {
    return debouncedSearch ? Text.create(debouncedSearch) : undefined
  }, [debouncedSearch])

  const { data, isLoading } = useCache({
    key: CACHE.avatarsTable.key,
    fetcher: async () =>
      await shopService.fetchAvatarsList({
        search,
        page: OrdinalNumber.create(page),
        itemsPerPage: ITEMS_PER_PAGE,
        order,
      }),
    dependencies: [debouncedSearch, order.value, page],
  })

  const avatars = data?.items ?? []
  const totalItemsCount = data?.totalItemsCount ?? 0
  const totalPages = Math.ceil(totalItemsCount / ITEMS_PER_PAGE.value)

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPage(1)
  }

  function handleOrderChange(newOrder: ListingOrder) {
    setOrder(newOrder)
    setPage(1)
  }

  function handlePrevPage() {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  function handleNextPage() {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  return {
    avatars,
    isLoading,
    searchInput,
    order,
    page,
    totalPages,
    totalItemsCount,
    itemsPerPage: ITEMS_PER_PAGE.value,
    handleSearchChange,
    handleOrderChange,
    handlePrevPage,
    handleNextPage,
  }
}
