import { useState, useMemo } from 'react'
import { useDebounceValue } from 'usehooks-ts'

import type { ShopService } from '@stardust/core/shop/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import type { UiProvider } from '@stardust/core/ui/interfaces'
import { ListingOrder, OrdinalNumber, Text, Id } from '@stardust/core/global/structures'
import type { RocketDto } from '@stardust/core/shop/entities/dtos'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'

const ITEMS_PER_PAGE = OrdinalNumber.create(10)

type Params = {
  shopService: ShopService
  toastProvider: ToastProvider
}

export function useRocketsTable({ shopService, toastProvider }: Params) {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch] = useDebounceValue(searchInput, 500)
  const [order, setOrder] = useState<ListingOrder>(ListingOrder.createAsAscending())
  const [page, setPage] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const search = useMemo(() => {
    return debouncedSearch ? Text.create(debouncedSearch) : undefined
  }, [debouncedSearch])

  const { data, isLoading, refetch } = useCache({
    key: CACHE.rocketsTable.key,
    fetcher: async () =>
      await shopService.fetchRocketsList({
        search,
        page: OrdinalNumber.create(page),
        itemsPerPage: ITEMS_PER_PAGE,
        order,
      }),
    dependencies: [debouncedSearch, order.value, page],
  })

  const rockets = data?.items ?? []
  const totalItemsCount = data?.totalItemsCount ?? 0
  const totalPages = Math.ceil(totalItemsCount / ITEMS_PER_PAGE.value)

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPage(1)
  }

  function handleOrderChange(newOrder: ListingOrder) {
    setOrder(newOrder)
    setPage(1)
  }

  function handlePrevPage() {
    if (page > 1) {
      setPage(page - 1)
    }
  }

  function handleNextPage() {
    if (page < totalPages) {
      setPage(page + 1)
    }
  }

  async function handleCreateRocket(data: {
    name: string
    image: string
    price: number
    isAcquiredByDefault?: boolean
    isSelectedByDefault?: boolean
  }): Promise<void> {
    setIsCreating(true)
    const rocketDto: RocketDto = {
      name: data.name,
      image: data.image,
      price: data.price,
      isAcquiredByDefault: data.isAcquiredByDefault,
      isSelectedByDefault: data.isSelectedByDefault,
    }

    const response = await shopService.createRocket(rocketDto)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      setIsCreating(false)
      return
    }

    if (response.isSuccessful) {
      toastProvider.showSuccess('Foguete criado com sucesso')
      refetch()
    }

    setIsCreating(false)
  }

  async function handleDeleteRocket(id: string) {
    const response = await shopService.deleteRocket(Id.create(id))

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    if (response.isSuccessful) {
      toastProvider.showSuccess('Foguete deletado com sucesso')
      refetch()
    }
  }

  async function handleUpdateRocket(
    data: {
      name: string
      image: string
      price: number
      isAcquiredByDefault?: boolean
      isSelectedByDefault?: boolean
    },
    id: string,
  ): Promise<void> {
    setIsUpdating(true)
    const rocketDto: RocketDto = {
      id,
      name: data.name,
      image: data.image,
      price: data.price,
      isAcquiredByDefault: data.isAcquiredByDefault,
      isSelectedByDefault: data.isSelectedByDefault,
    }

    const response = await shopService.updateRocket(rocketDto)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      setIsUpdating(false)
      return
    }

    if (response.isSuccessful) {
      toastProvider.showSuccess('Foguete atualizado com sucesso')
      refetch()
    }

    setIsUpdating(false)
  }

  return {
    rockets,
    isLoading: isLoading || isCreating || isUpdating,
    searchInput,
    order,
    page,
    totalPages,
    totalItemsCount,
    itemsPerPage: ITEMS_PER_PAGE.value,
    handleSearchChange,
    handleOrderChange,
    handlePrevPage,
    handleNextPage,
    handleCreateRocket,
    handleUpdateRocket,
    handleDeleteRocket,
  }
}
