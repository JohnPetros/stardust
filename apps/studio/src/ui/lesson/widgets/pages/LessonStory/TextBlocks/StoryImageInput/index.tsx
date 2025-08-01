import { StoryImageInputView } from './StoryImageInputView'
import { useRest } from '@/ui/global/hooks/useRest'
import { useStoryImageInput } from './useStoryImageInput'
import { useRef } from 'react'
import type { DialogRef } from '@/ui/shadcn/components/dialog'

export const StoryImageInput = () => {
  const { storageService } = useRest()
  const dialogRef = useRef<DialogRef>(null)
  const {
    selectedImage,
    images,
    isFetching,
    isFetchingNextPage,
    hasNextPage,
    handleSearchInputChange,
    handleImageSubmit,
    handleImageCardClick,
    handleLoadMoreButtonClick,
    handleImageCardRemove,
  } = useStoryImageInput(storageService, dialogRef)

  return (
    <StoryImageInputView
      dialogRef={dialogRef}
      selectedImage={selectedImage.value}
      images={images}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      onImageCardClick={handleImageCardClick}
      onSearchInputChange={handleSearchInputChange}
      onLoadMoreButtonClick={handleLoadMoreButtonClick}
      onImageCardRemove={handleImageCardRemove}
      onSubmitImage={handleImageSubmit}
    />
  )
}
