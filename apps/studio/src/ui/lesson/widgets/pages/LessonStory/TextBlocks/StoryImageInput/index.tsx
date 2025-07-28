import { StoryImageInputView } from './StoryImageInputView'
import { useRest } from '@/ui/global/hooks/useRest'
import { useStoryImageInput } from './useStoryImageInput'

export const StoryImageInput = () => {
  const { storageService } = useRest()
  const { selectedImage, images, handleSearchInputChange, handleImageCardClick } =
    useStoryImageInput(storageService)

  return (
    <StoryImageInputView
      selectedImage={selectedImage.value}
      images={images}
      onSearchInputChange={handleSearchInputChange}
      onClick={handleImageCardClick}
    />
  )
}
