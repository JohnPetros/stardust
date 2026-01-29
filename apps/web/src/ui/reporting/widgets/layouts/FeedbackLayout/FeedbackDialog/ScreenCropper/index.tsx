'use client'

import { ScreenCropperView } from './ScreenCropperView'
import { useScreenCropper } from './useScreenCropper'

type Props = {
  image: string
  onCropComplete: (croppedImage: string) => void
  onCancel: () => void
}

export const ScreenCropper = ({ image, onCropComplete, onCancel }: Props) => {
  const { cropperRef, handleDone, handleZoomIn, handleZoomOut } = useScreenCropper({
    onCropComplete,
  })

  return (
    <ScreenCropperView
      image={image}
      cropperRef={cropperRef}
      onCancel={onCancel}
      onDone={handleDone}
      onZoomIn={handleZoomIn}
      onZoomOut={handleZoomOut}
    />
  )
}
