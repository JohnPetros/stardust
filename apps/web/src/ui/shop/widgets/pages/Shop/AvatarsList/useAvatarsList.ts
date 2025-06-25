import { useState } from 'react'

import type { ShopService } from '@stardust/core/shop/interfaces'
import { Avatar } from '@stardust/core/shop/entities'
import { OrdinalNumber, ListingOrder, Text } from '@stardust/core/global/structures'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'

const AVATARS_PER_PAGE = 10

export function useAvatarsList(shopService: ShopService) {
  const [search, setSearch] = useState<Text>(Text.create(''))
  const [priceOrder, setPriceOrder] = useState<ListingOrder>(ListingOrder.create())

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

  async function fetchAvatars(page: number) {
    const response = await shopService.fetchAvatarsList({
      search: search,
      page: OrdinalNumber.create(page),
      itemsPerPage: OrdinalNumber.create(AVATARS_PER_PAGE),
      order: priceOrder,
    })

    if (response.isFailure) response.throwError()

    return response.body
  }

  const { data, page, totalItemsCount, setPage } = usePaginatedCache({
    key: CACHE.keys.shopRockets,
    fetcher: fetchAvatars,
    dependencies: [search.value, priceOrder.value],
    itemsPerPage: AVATARS_PER_PAGE,
  })

  return {
    avatars: data.map(Avatar.create),
    totalAvatarsCount: totalItemsCount,
    avatarsPerPage: AVATARS_PER_PAGE,
    page,
    handlePageChange,
    handleSearchChange,
    handlePriceOrderChange,
  }
}
