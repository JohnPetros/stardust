'use client'

import { useState } from 'react'

import { Pagination } from '@/@core/domain/structs'
import type { ListingOrder } from '@/@core/types'
import type { RocketDTO } from '@/@core/dtos'
import type { PaginationResponse } from '@/@core/responses'

import { useCache } from '@/infra/cache'
import { useApi } from '@/infra/api'
import { CACHE } from '@/modules/global/constants'
import { useToastContext } from '@/modules/global/contexts/ToastContext'
import { useAuthContext } from '@/modules/global/contexts/AuthContext'

export function useRocketsList(initialRocketsPagination: PaginationResponse<RocketDTO>) {
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('s')
  const [priceOrder, setPriceOrder] = useState<ListingOrder>('ascending')

  const api = useApi()
  const toast = useToastContext()
  const { user } = useAuthContext()

  console.log({ initialRocketsPagination })

  async function fetchRockets() {
    if (!user) return

    const response = await api.fetchShopRocketsList({
      search,
      offset,
      limit: Pagination.calculateLimit(offset),
      order: priceOrder,
    })

    if (response.isSuccess) return response.data

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
    rocketsDTO: data ? data.items : [],
    totalRockets: data ? data.count : 0,
    offset,
    setOffset,
    handleSearchChange,
    handlePriceOrderChange,
  }
}
