import { useRef } from 'react'

import type { Image } from '@stardust/core/global/structures'

import { useRest } from '@/ui/global/hooks/useRest'
import type { DialogRef } from '@/ui/shadcn/components/dialog'
import { PictureInputView } from './PictureInputView'
import { usePictureInput } from './usePictureInput'

type Props = {
  defaultPicture?: Image
  onChange: (picture: Image) => void
}

export const PictureInput = ({ defaultPicture, onChange }: Props) => {
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
    handlePictureCardClick,
    handleLoadMoreButtonClick,
    handlePictureCardRemove,
  } = usePictureInput({
    defaultPicture,
    storageService,
    dialogRef,
    onChange,
  })

  return (
    <PictureInputView
      dialogRef={dialogRef}
      selectedImage={selectedImage.value}
      images={images}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      onPictureCardClick={handlePictureCardClick}
      onSearchInputChange={handleSearchInputChange}
      onLoadMoreButtonClick={handleLoadMoreButtonClick}
      onPictureCardRemove={handlePictureCardRemove}
      onSubmitImage={handleImageSubmit}
    />
  )
}
