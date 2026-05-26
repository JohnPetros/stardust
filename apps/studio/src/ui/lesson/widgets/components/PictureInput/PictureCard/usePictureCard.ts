import type { StorageService } from '@stardust/core/storage/interfaces'
import { FileStorageFolderPath } from '@stardust/core/storage/structures'

import { useToastProvider } from '@/ui/global/hooks/useToastProvider'
import { Text } from '@stardust/core/global/structures'

export function usePictureCard(
  storageService: StorageService,
  onRemove: (imageName: string) => void,
) {
  const toast = useToastProvider()

  async function handleRemoveButtonClick(imageName: string) {
    const response = await storageService.removeFile(
      FileStorageFolderPath.createAsStory(),
      Text.create(imageName),
    )

    if (response.isFailure) {
      toast.showError(response.errorMessage)
    }

    if (response.isSuccessful) {
      onRemove(imageName)
    }
  }

  return {
    handleRemoveButtonClick,
  }
}
