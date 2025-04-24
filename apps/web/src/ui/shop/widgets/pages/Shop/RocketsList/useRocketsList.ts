'use client'

import { useState } from 'react'

import type { RocketDto } from '@stardust/core/shop/dtos'
import type { ListOrder } from '@stardust/core/global/types'
import type { PaginationResponse } from '@stardust/core/global/responses'

import { CACHE } from '@/constants'
import { useApi } from '@/ui/global/hooks/useApi'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'

const ROCKETS_PER_PAGE = 6

export function useRocketsList(initialRocketsPagination: PaginationResponse<RocketDto>) {
  const [search, setSearch] = useState('s')
  const [priceOrder, setPriceOrder] = useState<ListOrder>('ascending')
  const api = useApi()
  const { user } = useAuthContext()

  async function fetchRockets(page: number) {
    const response = await api.fetchShopRocketsList({
      search,
      page,
      itemsPerPage: ROCKETS_PER_PAGE,
      order: priceOrder,
    })
    if (response.isFailure) response.throwError()
    return response.body
  }

  const { data, page, totalItemsCount, setPage } = usePaginatedCache({
    key: CACHE.keys.shopRockets,
    fetcher: fetchRockets,
    dependencies: [search, priceOrder],
    itemsPerPage: ROCKETS_PER_PAGE,
    isEnabled: Boolean(user),
    initialData: initialRocketsPagination,
  })

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handlePriceOrderChange(value: ListOrder) {
    setPriceOrder(value)
  }

  function handlePageChange(page: number) {
    setPage(page)
  }

  return {
    rocketsDto: data,
    totalRocketsCount: totalItemsCount,
    rocketsPerPage: ROCKETS_PER_PAGE,
    page,
    handlePageChange,
    handleSearchChange,
    handlePriceOrderChange,
  }
}
