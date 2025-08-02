import type { StorageService } from '@stardust/core/storage/interfaces'
import { StorageFolder } from '@stardust/core/storage/structures'

import { useToast } from '@/ui/global/hooks/useToast'
import { Text } from '@stardust/core/global/structures'

export function usePictureCard(storageService: StorageService, onRemove: () => void) {
  const toast = useToast()

  async function handleRemoveButtonClick(imageName: string) {
    const response = await storageService.removeFile(
      StorageFolder.createAsStory(),
      Text.create(imageName),
    )

    if (response.isFailure) {
      toast.showError(response.errorMessage)
    }

    if (response.isSuccessful) {
      onRemove()
    }
  }

  return {
    handleRemoveButtonClick,
  }
}
