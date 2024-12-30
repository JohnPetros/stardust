'use client'

import { useState } from 'react'

import type { ListingOrder } from '@stardust/core/global/types'
import type { AvatarDto } from '@stardust/core/shop/dtos'
import type { PaginationResponse } from '@stardust/core/responses'

import { CACHE } from '@/constants'
import { useApi } from '@/ui/global/hooks/useApi'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'

const AVATARS_PER_PAGE = 8

export function useAvatarsList(initialAvatarsPagination: PaginationResponse<AvatarDto>) {
  const [search, setSearch] = useState('s')
  const [priceOrder, setPriceOrder] = useState<ListingOrder>('ascending')
  const api = useApi()
  const { user } = useAuthContext()

  async function fetchAvatars(page: number) {
    const response = await api.fetchShopAvatarsList({
      search,
      page,
      itemsPerPage: AVATARS_PER_PAGE,
      order: priceOrder,
    })

    if (response.isFailure) response.throwError()

    return response.body
  }

  const { data, page, totalItemsCount, setPage } = usePaginatedCache({
    key: CACHE.keys.shopRockets,
    fetcher: fetchAvatars,
    dependencies: [search, priceOrder],
    itemsPerPage: AVATARS_PER_PAGE,
    isEnabled: Boolean(user),
    initialData: initialAvatarsPagination,
  })

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
  }

  function handlePriceOrderChange(value: ListingOrder) {
    setPriceOrder(value)
  }

  function handlePageChange(page: number) {
    setPage(page)
  }

  return {
    AvatarsDto: data,
    totalAvatarsCount: totalItemsCount,
    avatarsPerPage: AVATARS_PER_PAGE,
    page,
    handlePageChange,
    handleSearchChange,
    handlePriceOrderChange,
  }
}
