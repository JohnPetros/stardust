import { useRest } from '@/ui/global/hooks/useRest'
import { PictureCardView } from './PictureCardView'
import { usePictureCard } from './usePictureCard'

type Props = {
  imageName: string
  isSelected: boolean
  onClick: (imageName: string) => void
  onRemove: () => void
}

export const PictureCard = ({ imageName, isSelected, onClick, onRemove }: Props) => {
  const { storageService } = useRest()
  const { handleRemoveButtonClick } = usePictureCard(storageService, onRemove)

  return (
    <PictureCardView
      imageName={imageName}
      isSelected={isSelected}
      onClick={onClick}
      onRemoveButtonClick={handleRemoveButtonClick}
    />
  )
}
