import { useClipboard } from '@/ui/global/hooks/useClipboard'

export function useImageCard() {
  const { copy } = useClipboard()

  function handleCopyButtonClick(imageName: string) {
    copy(imageName)
  }

  return {
    handleCopyButtonClick,
  }
}
