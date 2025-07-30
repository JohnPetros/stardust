import { useRest } from '@/ui/global/hooks/useRest'
import { ImageCardView } from './ImageCardView'
import { useImageCard } from './useImageCard'

type Props = {
  imageName: string
  onClick: (imageName: string) => void
}

export const ImageCard = ({ imageName, onClick }: Props) => {
  const { storageService } = useRest()
  const { handleCopyButtonClick, handleRemoveButtonClick } = useImageCard(storageService)

  return (
    <ImageCardView
      imageName={imageName}
      onClick={onClick}
      onCopyButtonClick={handleCopyButtonClick}
      onRemoveButtonClick={handleRemoveButtonClick}
    />
  )
}
