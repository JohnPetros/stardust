import { useRef, useState } from 'react'
import { CropperRef } from 'react-advanced-cropper'

type Params = {
  image: string
  onCropComplete: (croppedImage: string) => void
}

export function useScreenCropper({ onCropComplete }: Params) {
  const cropperRef = useRef<CropperRef>(null)
  function handleDone() {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas()
      if (canvas) {
        onCropComplete(canvas.toDataURL('image/png'))
      }
    }
  }

  return {
    cropperRef,
    handleDone,
  }
}
