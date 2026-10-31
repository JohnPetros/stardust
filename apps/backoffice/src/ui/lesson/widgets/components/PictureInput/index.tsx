import { useRef } from 'react'

import type { Image } from '@stardust/core/global/structures'

import { useRestContext } from '@/ui/global/hooks/useRestContext'
import type { DialogRef } from '@/ui/shadcn/components/dialog'
import { PictureInputView } from './PictureInputView'
import { usePictureInput } from './usePictureInput'

type Props = {
  defaultPicture?: Image
  onChange: (picture: Image) => void
  isOptional?: boolean
  onClear?: () => void
}

export const PictureInput = ({
  defaultPicture,
  onChange,
  isOptional,
  onClear,
}: Props) => {
  const { storageService } = useRestContext()
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
    handleClearSelection,
  } = usePictureInput({
    defaultPicture,
    storageService,
    dialogRef,
    isOptional,
    onClear,
    onChange,
  })

  return (
    <PictureInputView
      dialogRef={dialogRef}
      selectedImage={selectedImage?.value}
      images={images}
      isOptional={Boolean(isOptional)}
      isFetching={isFetching}
      isFetchingNextPage={isFetchingNextPage}
      hasNextPage={hasNextPage}
      onPictureCardClick={handlePictureCardClick}
      onSearchInputChange={handleSearchInputChange}
      onLoadMoreButtonClick={handleLoadMoreButtonClick}
      onPictureCardRemove={handlePictureCardRemove}
      onSubmitImage={handleImageSubmit}
      onClearSelection={handleClearSelection}
    />
  )
}
