import { useState, useMemo } from 'react'
import { useDebounceValue } from 'usehooks-ts'

import type { ShopService } from '@stardust/core/shop/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import type { StorageService } from '@stardust/core/storage/interfaces'
import type { RocketDto } from '@stardust/core/shop/entities/dtos'
import { ListingOrder, OrdinalNumber, Text, Id } from '@stardust/core/global/structures'
import { Rocket } from '@stardust/core/shop/entities'
import { StorageFolder } from '@stardust/core/storage/structures'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { useQueryStringParam } from '@/ui/global/hooks/useQueryStringParam'
import { useQueryNumberParam } from '@/ui/global/hooks/useQueryNumberParam'

type Params = {
  shopService: ShopService
  toastProvider: ToastProvider
  storageService: StorageService
}

export function useRocketsTable({ shopService, toastProvider, storageService }: Params) {
  const [searchInput, setSearchInput] = useQueryStringParam('q', '')
  const [debouncedSearch] = useDebounceValue(searchInput, 500)
  const [priceOrderValue, setPriceOrderValue] = useQueryStringParam(
    'priceOrder',
    'ascending',
  )
  const [page, setPage] = useQueryNumberParam('page', 1)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [itemsPerPage, setItemsPerPage] = useQueryNumberParam('limit', 10)

  const priceOrder = useMemo(
    () => ListingOrder.create(priceOrderValue),
    [priceOrderValue],
  )

  const search = useMemo(() => {
    return debouncedSearch ? Text.create(debouncedSearch) : undefined
  }, [debouncedSearch])

  const {
    data: rocketsData,
    isFetching,
    refetch,
    totalItemsCount,
  } = usePaginatedCache({
    key: CACHE.rocketsTable.key,
    fetcher: async () =>
      await shopService.fetchRocketsList({
        search,
        page: OrdinalNumber.create(page),
        itemsPerPage: OrdinalNumber.create(itemsPerPage),
        priceOrder,
      }),
    dependencies: [debouncedSearch, priceOrder.value, page, itemsPerPage],
    itemsPerPage,
  })

  const rockets = rocketsData ?? []
  const totalPages = Math.ceil(totalItemsCount / itemsPerPage)

  async function removeImageFile(imageName: string) {
    const response = await storageService.removeFile(
      StorageFolder.createAsRockets(),
      Text.create(imageName),
    )
    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }
  }

  function handleSearchChange(value: string) {
    setSearchInput(value)
    setPage(1)
  }

  function handlePriceOrderChange(newOrder: ListingOrder) {
    setPriceOrderValue(newOrder.value)
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

  function handlePageChange(page: number) {
    setPage(page)
  }

  function handleItemsPerPageChange(count: number) {
    setItemsPerPage(count)
    setPage(1)
  }

  async function handleCreateRocket(dto: RocketDto): Promise<void> {
    setIsCreating(true)
    const rocket = Rocket.create(dto)
    const response = await shopService.createRocket(rocket)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      await removeImageFile(dto.image)
      setIsCreating(false)
      return
    }

    if (response.isSuccessful) {
      toastProvider.showSuccess('Foguete criado com sucesso')
      refetch()
    }

    setIsCreating(false)
  }

  async function handleDeleteRocket(id: string, imageName: string) {
    const response = await shopService.deleteRocket(Id.create(id))

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    if (response.isSuccessful) {
      await removeImageFile(imageName)
      toastProvider.showSuccess('Foguete deletado com sucesso')
      refetch()
    }
  }

  async function handleUpdateRocket(dto: RocketDto): Promise<void> {
    setIsUpdating(true)
    const rocket = Rocket.create(dto)
    const response = await shopService.updateRocket(rocket)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      await removeImageFile(dto.image)
      setIsUpdating(false)
      return
    }

    if (response.isSuccessful) {
      await removeImageFile(dto.image)
      toastProvider.showSuccess('Foguete atualizado com sucesso')
      refetch()
    }

    setIsUpdating(false)
  }

  return {
    rockets,
    isLoading: isFetching || isCreating || isUpdating,
    searchInput,
    priceOrder,
    page,
    totalPages,
    totalItemsCount,
    itemsPerPage,
    handleSearchChange,
    handlePriceOrderChange,
    handlePrevPage,
    handleNextPage,
    handlePageChange,
    handleItemsPerPageChange,
    handleCreateRocket,
    handleUpdateRocket,
    handleDeleteRocket,
  }
}
