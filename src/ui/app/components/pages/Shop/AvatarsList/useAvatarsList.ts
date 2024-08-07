'use client'

import { useState } from 'react'

import type { ListingOrder } from '@/@core/types'
import type { AvatarDTO } from '@/@core/dtos'
import type { PaginationResponse } from '@/@core/responses'

import { useCache } from '@/infra/cache'
import { useApi } from '@/infra/api'
import { CACHE } from '@/ui/global/constants'
import { useToastContext } from '@/ui/global/contexts/ToastContext'
import { useAuthContext } from '@/ui/global/contexts/AuthContext'

const AVATARS_PER_PAGE = 8

export function useAvatarsList(initialItems: PaginationResponse<AvatarDTO>) {
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

    console.log(response.data)

    if (response.isSuccess) return response.data

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
    AvatarsDTO: data ? data.items : [],
    totalAvatars: data ? data.count : 0,
    avatarsPerPage: AVATARS_PER_PAGE,
    offset,
    setOffset,
    handleSearchChange,
    handlePriceOrderChange,
  }
}