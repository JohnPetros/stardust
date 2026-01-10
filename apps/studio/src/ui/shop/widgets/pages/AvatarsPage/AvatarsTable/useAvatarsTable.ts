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
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const search = useMemo(() => {
    return debouncedSearch ? Text.create(debouncedSearch) : undefined
  }, [debouncedSearch])

  const {
    data: avatarsData,
    isFetching,
    refetch,
    totalItemsCount,
  } = usePaginatedCache({
    key: CACHE.avatarsTable.key,
    fetcher: async () =>
      await shopService.fetchAvatarsList({
        search,
        page: OrdinalNumber.create(page),
        itemsPerPage: OrdinalNumber.create(itemsPerPage),
        order,
      }),
    dependencies: [debouncedSearch, order.value, page, itemsPerPage],
    itemsPerPage,
  })

  const avatars = avatarsData ?? []
  const totalPages = Math.ceil(totalItemsCount / itemsPerPage)

  async function removeImageFile(imageName: string) {
    const response = await storageService.removeFile(
      StorageFolder.createAsAvatars(),
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

  function handlePageChange(page: number) {
    setPage(page)
  }

  function handleItemsPerPageChange(count: number) {
    setItemsPerPage(count)
    setPage(1)
  }

  async function handleCreateAvatar(dto: AvatarDto) {
    setIsCreating(true)
    const avatar = Avatar.create(dto)
    const response = await shopService.createAvatar(avatar)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      await removeImageFile(dto.image)
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
      await removeImageFile(avatarDto.image)
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
      await removeImageFile(imageName)
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
    isLoading: isFetching || isCreating || isUpdating,
    searchInput,
    order,
    page,
    totalPages,
    totalItemsCount,
    itemsPerPage,
    handleSearchChange,
    handleOrderChange,
    handlePrevPage,
    handleNextPage,
    handlePageChange,
    handleItemsPerPageChange,
    handleCreateAvatar,
    handleUpdateAvatar,
    handleDeleteAvatar,
  }
}
