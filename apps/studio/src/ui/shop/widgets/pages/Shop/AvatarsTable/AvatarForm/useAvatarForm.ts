import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import type { z } from 'zod'

import { avatarSchema } from '@stardust/validation/shop/schemas'
import { StorageFolder } from '@stardust/core/storage/structures'
import { Text } from '@stardust/core/global/structures'
import type { StorageService } from '@stardust/core/storage/interfaces'
import type { AvatarDto } from '@stardust/core/shop/entities/dtos'

const AVATAR_FOLDER = StorageFolder.createAsAvatars()

type FormData = z.infer<typeof avatarSchema>

type Params = {
  storageService: StorageService
  onSubmit: (data: FormData) => void
  initialValues?: AvatarDto
}

export function useAvatarForm({ storageService, onSubmit, initialValues }: Params) {
  const form = useForm<FormData>({
    resolver: zodResolver(avatarSchema),
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const initialImage = initialValues?.image ?? ''

  async function handleSubmit(data: FormData) {
    if (initialValues?.id) {
      data.id = initialValues.id
    }
    onSubmit(data)
    setIsDialogOpen(false)
  }

  async function handleDialogChange(isOpen: boolean) {
    if (!isOpen) {
      const { image } = form.getValues()
      if (image && image !== initialImage) {
        await storageService.removeFile(AVATAR_FOLDER, Text.create(image))
      }
    }
    setIsDialogOpen(isOpen)
  }

  useEffect(() => {
    if (initialValues && isDialogOpen) {
      form.setValue('image', initialValues.image)
      form.setValue('name', initialValues.name)
      form.setValue('price', initialValues.price)
      form.setValue('isAcquiredByDefault', initialValues.isAcquiredByDefault)
      form.setValue('isSelectedByDefault', initialValues.isSelectedByDefault)
    }
  }, [initialValues, form, isDialogOpen])

  return {
    form,
    isDialogOpen,
    isSubmitting: form.formState.isSubmitting,
    avatarImage: form.watch('image'),
    handleSubmit: form.handleSubmit(handleSubmit),
    handleDialogChange,
  }
}
