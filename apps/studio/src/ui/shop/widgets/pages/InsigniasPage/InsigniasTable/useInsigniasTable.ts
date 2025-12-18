import { useState } from 'react'

import type { ShopService } from '@stardust/core/shop/interfaces'
import type { ToastProvider } from '@stardust/core/global/interfaces'
import type { InsigniaDto } from '@stardust/core/shop/entities/dtos'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { Insignia } from '@stardust/core/shop/entities'
import { StorageFolder } from '@stardust/core/storage/structures'
import { Text } from '@stardust/core/global/structures'

import { CACHE } from '@/constants'
import { useCache } from '@/ui/global/hooks/useCache'

type Params = {
  shopService: ShopService
  toastProvider: ToastProvider
  storageService: StorageService
}

export function useInsigniasTable({
  shopService,
  toastProvider,
  storageService,
}: Params) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data, isLoading, refetch } = useCache({
    key: CACHE.insigniasTable.key,
    fetcher: async () => await shopService.fetchInsigniasList(),
    dependencies: [],
  })

  async function removeImageFile(imageName: string) {
    const response = await storageService.removeFile(
      StorageFolder.createAsInsignias(),
      Text.create(imageName),
    )
    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      return
    }
  }

  async function handleCreateInsignia(dto: InsigniaDto): Promise<void> {
    setIsSubmitting(true)
    const insignia = Insignia.create(dto)
    const response = await shopService.createInsignia(insignia)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      await removeImageFile(insignia.image.value)
      setIsSubmitting(false)
      return
    }

    if (response.isSuccessful) {
      toastProvider.showSuccess('Insígnia criada com sucesso')
      refetch()
    }

    setIsSubmitting(false)
  }

  async function handleUpdateInsignia(dto: InsigniaDto): Promise<void> {
    setIsSubmitting(true)
    const insignia = Insignia.create(dto)
    const response = await shopService.updateInsignia(insignia)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      await removeImageFile(dto.image)
      setIsSubmitting(false)
      return
    }

    if (response.isSuccessful) {
      toastProvider.showSuccess('Insígnia atualizada com sucesso')
      refetch()
    }

    setIsSubmitting(false)
  }

  async function handleDeleteInsignia(
    insigniaId: string,
    imageName: string,
  ): Promise<void> {
    setIsSubmitting(true)
    const response = await shopService.deleteInsignia(Text.create(insigniaId) as any)

    if (response.isFailure) {
      toastProvider.showError(response.errorMessage)
      await removeImageFile(imageName)
      setIsSubmitting(false)
      return
    }

    if (response.isSuccessful) {
      toastProvider.showSuccess('Insígnia deletada com sucesso')
      refetch()
    }

    setIsSubmitting(false)
  }

  return {
    insignias: data ?? [],
    isLoading: isLoading || isSubmitting,
    refetch,
    handleCreateInsignia,
    handleUpdateInsignia,
    handleDeleteInsignia,
  }
}
