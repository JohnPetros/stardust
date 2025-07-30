import { useClipboard } from '@/ui/global/hooks/useClipboard'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { useToast } from '@/ui/global/hooks/useToast'
import { Text } from '@stardust/core/global/structures'

export function useImageCard(storageService: StorageService) {
  const { copy } = useClipboard()
  const toast = useToast()

  async function handleRemoveButtonClick(imageName: string) {
    const response = await storageService.removeFile('story', Text.create(imageName))

    if (response.isFailure) {
      toast.showError(response.errorMessage)
    }
  }

  function handleCopyButtonClick(imageName: string) {
    copy(imageName)
  }

  return {
    handleCopyButtonClick,
    handleRemoveButtonClick,
  }
}
