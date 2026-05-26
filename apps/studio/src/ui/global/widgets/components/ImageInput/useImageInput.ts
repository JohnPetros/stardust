import { useState, type RefObject } from 'react'

import { Image, Text } from '@stardust/core/global/structures'
import type {
  SignedFileStorageProvider,
  StorageService,
} from '@stardust/core/storage/interfaces'
import {
  type FileStorageFolderPath,
  SignedUploadUrl,
} from '@stardust/core/storage/structures'

import type { DialogRef } from '@/ui/shadcn/components/dialog'
import { useToastProvider } from '@/ui/global/hooks/useToastProvider'

type Params = {
  storageService: StorageService
  signedFileStorageProvider: SignedFileStorageProvider
  folder: FileStorageFolderPath
  dialogRef: RefObject<DialogRef | null>
  onSubmit: (imageName: string) => void
}

export function useImageInput({
  storageService,
  signedFileStorageProvider,
  folder,
  dialogRef,
  onSubmit,
}: Params) {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imageName, setImageName] = useState<string>('')
  const [imageNameError, setImageNameError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toast = useToastProvider()

  function handleImageFileChange(file: File | null) {
    setImageFile(file)
    setImageName(file?.name ?? '')
  }

  function handleImageNameChange(name: string) {
    setImageName(name)
    setImageNameError('')

    if (imageFile) {
      setImageFile(new File([imageFile], name, { type: imageFile.type }))
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
    try {
      const response = await storageService.createSignedUploadUrl(
        folder,
        Text.create(imageFile.name),
      )

      if (response.isFailure) {
        toast.showError(response.errorMessage)
        return
      }

      const signedUploadUrl = SignedUploadUrl.create(response.body)
      await signedFileStorageProvider.uploadFile(signedUploadUrl, imageFile)

      dialogRef.current?.close()
      onSubmit(signedUploadUrl.fileName.value)
      setImageFile(null)
      setImageName('')
      setImageNameError('')
    } catch (error) {
      toast.showError(error instanceof Error ? error.message : 'Falha ao enviar arquivo')
    } finally {
      setIsSubmitting(false)
    }
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
