import { type PropsWithChildren, useRef } from 'react'

import type { DialogRef } from '@/ui/shadcn/components/dialog'
import { useRest } from '@/ui/global/hooks/useRest'
import { ImageInputView } from './ImageInputView'
import { useImageInput } from './useImageInput'
import type { StorageFolder } from '@stardust/core/storage/types'

type Props = {
  folder: StorageFolder
}

export const ImageInput = ({ children, folder }: PropsWithChildren<Props>) => {
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
  } = useImageInput(storageService, folder, dialogRef)

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
