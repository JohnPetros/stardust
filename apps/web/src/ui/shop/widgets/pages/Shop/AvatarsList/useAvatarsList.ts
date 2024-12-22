'use client'

import { useState } from 'react'

import type { ListingOrder } from '@stardust/core/global/types'
import type { AvatarDto } from '@stardust/core/shop/dtos'
import type { PaginationResponse } from '@stardust/core/responses'

import { CACHE } from '@/constants'
import { useApi, useCache } from '@/ui/global/hooks'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useAuthContext } from '@/ui/auth/contexts/AuthContext'

const AVATARS_PER_PAGE = 8

export function useAvatarsList(initialItems: PaginationResponse<AvatarDto>) {
  const [offset, setOffset] = useState(0)
  const [search, setSearch] = useState('s')
  const [priceOrder, setPriceOrder] = useState<ListingOrder>('ascending')

  const api = useApi()
  const toast = useToastContext()
  const { user } = useAuthContext()

  async function fetchAvatars() {
    if (!user) return

    const response = await api.fetchShopAvatarsList({
      search,
      offset,
      limit: offset + AVATARS_PER_PAGE - 1,
      order: priceOrder,
    })

    if (response.isSuccess) return response.body

    toast.show(response.errorMessage)
  }

  const { data } = useCache({
    key: CACHE.keys.shopAvatars,
    fetcher: fetchAvatars,
    dependencies: [search, offset, priceOrder],
    isEnabled: !!user,
    initialData: initialItems,
  })

  function handleSearchChange(value: string) {
    setSearch(value)
    setOffset(0)
  }

  function handlePriceOrderChange(value: ListingOrder) {
    setPriceOrder(value)
  }

  return {
    AvatarsDto: data ? data.items : [],
    totalAvatars: data ? data.count : 0,
    avatarsPerPage: AVATARS_PER_PAGE,
    offset,
    setOffset,
    handleSearchChange,
    handlePriceOrderChange,
  }
}
