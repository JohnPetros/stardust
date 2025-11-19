import { useState } from 'react'

import { ListingOrder, OrdinalNumber, Text } from '@stardust/core/global/structures'
import type { ShopService } from '@stardust/core/shop/interfaces'

import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { CACHE } from '@/constants'
import { Insignia } from '@stardust/core/shop/entities'
import { useCache } from '@/ui/global/hooks/useCache'

const INSIGNIAS_PER_PAGE = OrdinalNumber.create(6)

export function useInsiginiasList(service: ShopService) {
  const [search, setSearch] = useState<Text>(Text.create(''))
  const [priceOrder, setPriceOrder] = useState<ListingOrder>(ListingOrder.create())

  async function fetchInsignias(page: number) {
    const response = await service.fetchInsigniasList()
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, page, totalItemsCount, setPage } = useCache({
    key: CACHE.keys.shopInsignias,
    fetcher: fetchInsignias,
    dependencies: [search.value, priceOrder.value],
    itemsPerPage: INSIGNIAS_PER_PAGE.value,
  })

  function handleSearchChange(value: string) {
    setSearch(Text.create(value))
    setPage(1)
  }

  function handlePriceOrderChange(ListingOrder: ListingOrder) {
    setPriceOrder(ListingOrder)
  }

  function handlePageChange(page: number) {
    setPage(page)
  }

  return {
    insignias: data.map(Insignia.create),
    totalInsigniasCount: totalItemsCount,
    insigniasPerPage: INSIGNIAS_PER_PAGE.value,
    page,
    handlePageChange,
    handleSearchChange,
    handlePriceOrderChange,
  }
}
