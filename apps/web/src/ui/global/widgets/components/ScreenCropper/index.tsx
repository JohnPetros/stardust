'use client'

import { useScreenCropper } from './useScreenCropper'
import { ScreenCropperView } from './ScreenCropperView'

type Props = {
  image: string
  onCropComplete: (croppedImage: string) => void
  onCancel: () => void
}

export function ScreenCropper({ image, onCropComplete, onCancel }: Props) {
  const { cropperRef, handleDone } = useScreenCropper({
    image,
    onCropComplete,
  })

  return (
    <ScreenCropperView
      image={image}
      cropperRef={cropperRef}
      onCancel={onCancel}
      handleDone={handleDone}
    />
  )
}
