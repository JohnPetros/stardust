'use client'

import { useState } from 'react'

import type { RocketDto } from '@stardust/core/shop/dtos'
import type { ListingOrder } from '@stardust/core/global/types'
import type { PaginationResponse } from '@stardust/core/responses'

import { useApi, useCache } from '@/ui/global/hooks'
import { CACHE } from '@/constants'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

const ROCKETS_PER_PAGE = 6

export function useRocketsList(initialRocketsPagination: PaginationResponse<RocketDto>) {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('s')
  const [priceOrder, setPriceOrder] = useState<ListingOrder>('ascending')
  const api = useApi()
  const toast = useToastContext()
  const { user } = useAuthContext()

  async function fetchRockets() {
    if (!user) return

    const response = await api.fetchShopRocketsList({
      search,
      page,
      itemsPerPage: ROCKETS_PER_PAGE,
      order: priceOrder,
    })

    if (response.isSuccess) return response.body

    toast.show(response.errorMessage)
  }

  const { data } = useCache({
    key: CACHE.keys.shopRockets,
    fetcher: fetchRockets,
    dependencies: [search, page, priceOrder],
    isEnabled: !!user,
    initialData: initialRocketsPagination,
  })

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(0)
  }

  function handlePriceOrderChange(value: ListingOrder) {
    setPriceOrder(value)
  }

  function handlePageChange(page: number) {
    setPage(page)
  }

  return {
    rocketsDto: data ? data.items : [],
    totalRocketsCount: data ? data.count : 0,
    rocketsPerPage: ROCKETS_PER_PAGE,
    page,
    handlePageChange,
    handleSearchChange,
    handlePriceOrderChange,
  }
}
