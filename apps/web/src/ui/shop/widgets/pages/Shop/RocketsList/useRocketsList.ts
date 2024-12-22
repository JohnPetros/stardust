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
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('s')
  const [priceOrder, setPriceOrder] = useState<ListingOrder>('ascending')

  const api = useApi()
  const toast = useToastContext()
  const { user } = useAuthContext()

  async function fetchRockets() {
    if (!user) return

    const response = await api.fetchShopRocketsList({
      search,
      offset,
      limit: offset + ROCKETS_PER_PAGE - 1,
      order: priceOrder,
    })

    if (response.isSuccess) return response.body

    toast.show(response.errorMessage)
  }

  const { data } = useCache({
    key: CACHE.keys.shopRockets,
    fetcher: fetchRockets,
    dependencies: [search, offset, priceOrder],
    isEnabled: !!user,
    initialData: initialRocketsPagination,
  })

  function handleSearchChange(value: string) {
    setSearch(value)
    setOffset(0)
  }

  function handlePriceOrderChange(value: ListingOrder) {
    setPriceOrder(value)
  }

  return {
    rocketsDto: data ? data.items : [],
    totalRockets: data ? data.count : 0,
    rocketsPerPage: ROCKETS_PER_PAGE,
    offset,
    setOffset,
    handleSearchChange,
    handlePriceOrderChange,
  }
}
