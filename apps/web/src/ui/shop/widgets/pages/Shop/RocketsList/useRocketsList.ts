import { useState } from 'react'

import { Rocket } from '@stardust/core/shop/entities'
import { OrdinalNumber, ListingOrder, Text } from '@stardust/core/global/structures'
import type { ShopService } from '@stardust/core/shop/interfaces'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'

const ROCKETS_PER_PAGE = 6

export function useRocketsList(shopService: ShopService) {
  const [search, setSearch] = useState<Text>(Text.create(''))
  const [priceOrder, setPriceOrder] = useState<ListingOrder>(ListingOrder.create())

  async function fetchRockets(page: number) {
    const response = await shopService.fetchRocketsList({
      search: search,
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(ROCKETS_PER_PAGE),
      order: priceOrder,
    })
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, page, totalItemsCount, setPage } = usePaginatedCache({
    key: CACHE.keys.shopRockets,
    fetcher: fetchRockets,
    dependencies: [search.value, priceOrder.value],
    itemsPerPage: ROCKETS_PER_PAGE,
  })

  function handleSearchChange(value: string) {
    setSearch(Text.create(value))
    setPage(1)
  }

  function handlePriceOrderChange(value: string) {
    setPriceOrder(ListingOrder.create(value))
  }

  function handlePageChange(page: number) {
    setPage(page)
  }

  return {
    rockets: data.map(Rocket.create),
    totalRocketsCount: totalItemsCount,
    rocketsPerPage: ROCKETS_PER_PAGE,
    page,
    handlePageChange,
    handleSearchChange,
    handlePriceOrderChange,
  }
}
