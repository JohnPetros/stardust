import { ImageCardView } from './ImageCardView'
import { useImageCard } from './useImageCard'

type Props = {
  imageName: string
  onClick: (imageName: string) => void
}

export const ImageCard = ({ imageName, onClick }: Props) => {
  const { handleCopyButtonClick } = useImageCard()

  return (
    <ImageCardView
      imageName={imageName}
      onClick={onClick}
      onCopyButtonClick={handleCopyButtonClick}
    />
  )
}
