import { useRest } from '@/ui/global/hooks/useRest'
import { ImageCardView } from './ImageCardView'
import { useImageCard } from './useImageCard'

type Props = {
  imageName: string
  isSelected: boolean
  onClick: (imageName: string) => void
  onRemove: () => void
}

export const ImageCard = ({ imageName, isSelected, onClick, onRemove }: Props) => {
  const { storageService } = useRest()
  const { handleRemoveButtonClick } = useImageCard(storageService, onRemove)

  return (
    <ImageCardView
      imageName={imageName}
      isSelected={isSelected}
      onClick={onClick}
      onRemoveButtonClick={handleRemoveButtonClick}
    />
  )
}
