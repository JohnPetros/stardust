import { useState, type RefObject } from 'react'

import type { StorageService } from '@stardust/core/storage/interfaces'
import type { StorageFolder } from '@stardust/core/storage/types'
import { Image } from '@stardust/core/global/structures'

import type { DialogRef } from '@/ui/shadcn/components/dialog'
import { useToast } from '@/ui/global/hooks/useToast'

type Params = {
  storageService: StorageService
  folder: StorageFolder
  dialogRef: RefObject<DialogRef | null>
  onSubmit: () => void
}

export function useImageInput({ storageService, folder, dialogRef, onSubmit }: Params) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageName, setImageName] = useState<string>('')
  const [imageNameError, setImageNameError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToast()

  function handleImageFileChange(file: File | null) {
    setImageFile(file)
    setImageName(file?.name ?? '')
  }

  function handleImageNameChange(name: string) {
    setImageName(name)
    setImageNameError('')

    if (imageFile) {
      setImageFile(new File([imageFile], imageName, { type: imageFile.type }))
    }
  }

  async function handleSubmit() {
    if (!imageFile) return

    try {
      Image.create(imageName)
    } catch (error) {
      setImageNameError(error instanceof Error ? error.message : 'Nome inválido')
      return
    }

    setIsSubmitting(true)
    const response = await storageService.uploadFile(folder, imageFile)

    if (response.isSuccessful) {
      dialogRef.current?.close()
      onSubmit()
    }
    if (response.isFailure) {
      toast.showError(response.errorMessage)
    }

    setIsSubmitting(false)
    setImageFile(null)
    setImageName('')
    setImageNameError('')
  }

  return {
    imageFile,
    isFilled: Boolean(imageFile),
    imageName,
    isSubmitting,
    imageNameError,
    handleImageFileChange,
    handleImageNameChange,
    handleSubmit,
  }
}
