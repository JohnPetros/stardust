import { type PropsWithChildren, useRef } from 'react'

import { StorageFolder } from '@stardust/core/storage/structures'

import type { DialogRef } from '@/ui/shadcn/components/dialog'
import { useRest } from '@/ui/global/hooks/useRest'
import { ImageInputView } from './ImageInputView'
import { useImageInput } from './useImageInput'

type Props = {
  folder: string
  onSubmit: () => void
}

export const ImageInput = ({ children, folder, onSubmit }: PropsWithChildren<Props>) => {
  const dialogRef = useRef<DialogRef>(null)
  const { storageService } = useRest()
  const {
    imageName,
    isFilled,
    isSubmitting,
    imageNameError,
    handleImageFileChange,
    handleImageNameChange,
    handleSubmit,
  } = useImageInput({
    storageService,
    folder: StorageFolder.create(folder),
    dialogRef,
    onSubmit,
  })

  return (
    <ImageInputView
      dialogRef={dialogRef}
      imageName={imageName}
      isFilled={isFilled}
      isSubmitting={isSubmitting}
      imageNameError={imageNameError}
      onFileChange={handleImageFileChange}
      onNameChange={handleImageNameChange}
      onSubmit={handleSubmit}
    >
      {children}
    </ImageInputView>
  )
}
