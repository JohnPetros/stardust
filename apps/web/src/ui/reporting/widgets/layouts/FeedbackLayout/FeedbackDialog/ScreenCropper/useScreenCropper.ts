import { useRef } from 'react'

type Params = {
  onCropComplete: (croppedImage: string) => void
}

export function useScreenCropper({ onCropComplete }: Params) {
  const cropperRef = useRef<any>(null)

  function handleDone() {
    if (cropperRef.current) {
      const canvas = cropperRef.current.getCanvas()
      if (canvas) {
        onCropComplete(canvas.toDataURL('image/png'))
      }
    }
  }

  function handleZoomIn() {
    if (cropperRef.current) {
      cropperRef.current.zoomImage(1.1)
    }
  }

  function handleZoomOut() {
    if (cropperRef.current) {
      cropperRef.current.zoomImage(0.9)
    }
  }

  return {
    cropperRef,
    handleDone,
    handleZoomIn,
    handleZoomOut,
  }
}
