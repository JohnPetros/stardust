import { useState, useMemo } from 'react'
import { useDebounceValue } from 'usehooks-ts'

import type { ShopService } from '@stardust/core/shop/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { ListingOrder, OrdinalNumber, Text, Id } from '@stardust/core/global/structures'
import type { AvatarDto } from '@stardust/core/shop/entities/dtos'

import { CACHE } from '@/constants'
import { usePaginatedCache } from '@/ui/global/hooks/usePaginatedCache'
import { Avatar } from '@stardust/core/shop/entities'
import { StorageFolder } from '@stardust/core/storage/structures'

const ITEMS_PER_PAGE = OrdinalNumber.create(10)

type Params = {
  shopService: ShopService
  toastProvider: ToastProvider
  storageService: StorageService
}

export function useAvatarsTable({ shopService, toastProvider, storageService }: Params) {
  const [searchInput, setSearchInput] = useState('')
  const [debouncedSearch] = useDebounceValue(searchInput, 500)
  const [order, setOrder] = useState<ListingOrder>(ListingOrder.createAsAscending())
  const [page, setPage] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const search = useMemo(() => {
    return debouncedSearch ? Text.create(debouncedSearch) : undefined
  }, [debouncedSearch])

  const {
    data: avatarsData,
    isLoading,
    refetch,
    totalItemsCount,
  } = usePaginatedCache({
    key: CACHE.avatarsTable.key,
    fetcher: async () =>
      await shopService.fetchAvatarsList({
        search,
        page: OrdinalNumber.create(page),
        itemsPerPage: ITEMS_PER_PAGE,
        order,
      }),
    dependencies: [debouncedSearch, order.value, page],
    itemsPerPage: ITEMS_PER_PAGE.value,
  })

  const avatars = avatarsData ?? []
  const totalPages = Math.ceil(totalItemsCount / ITEMS_PER_PAGE.value)

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

  async function handleCreateAvatar(dto: AvatarDto) {
    setIsCreating(true)
    const avatar = Avatar.create(dto)
    const response = await shopService.createAvatar(avatar)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      setIsCreating(false)
      return
    }

    if (response.isSuccessful) {
      toastProvider.showSuccess('Avatar criado com sucesso')
      refetch()
    }

    setIsCreating(false)
  }

  async function handleUpdateAvatar(avatarDto: AvatarDto) {
    if (!avatarDto.id) return

    setIsUpdating(true)
    const avatar = Avatar.create(avatarDto)
    const response = await shopService.updateAvatar(avatar)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      setIsUpdating(false)
      return
    }

    if (response.isSuccessful) {
      toastProvider.showSuccess('Avatar atualizado com sucesso')
      await removeImageFile(avatarDto.image)
      refetch()
    }

    setIsUpdating(false)
  }

  async function handleDeleteAvatar(id: string, imageName: string) {
    const storageResponse = await storageService.removeFile(
      StorageFolder.createAsAvatars(),
      Text.create(imageName),
    )
    if (storageResponse.isFailure) {
      toastProvider.showError(storageResponse.errorMessage)
      return
    }
    const response = await shopService.deleteAvatar(Id.create(id))

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }

    if (response.isSuccessful) {
      toastProvider.showSuccess('Avatar excluído com sucesso')
      await removeImageFile(imageName)
      refetch()
    }
  }

  return {
    avatars,
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
    handleCreateAvatar,
    handleUpdateAvatar,
    handleDeleteAvatar,
  }
}
