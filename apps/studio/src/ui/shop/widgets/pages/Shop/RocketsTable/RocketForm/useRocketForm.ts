import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import type { z } from 'zod'

import { rocketSchema } from '@stardust/validation/shop/schemas'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { StorageFolder } from '@stardust/core/storage/structures'
import { Text } from '@stardust/core/global/structures'

const ROCKETS_FOLDER = StorageFolder.createAsRockets()

const formSchema = rocketSchema

type FormData = z.infer<typeof formSchema>

import type { RocketDto } from '@stardust/core/shop/entities/dtos'

type Params = {
  storageService: StorageService
  onSubmit: (data: FormData) => void
  initialValues?: RocketDto
}

export function useRocketForm({ storageService, onSubmit, initialValues }: Params) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialValues?.name ?? '',
      image: initialValues?.image ?? '',
      price: initialValues?.price ?? 0,
      isAcquiredByDefault: initialValues?.isAcquiredByDefault ?? false,
      isSelectedByDefault: initialValues?.isSelectedByDefault ?? false,
    },
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const initialImage = initialValues?.image ?? ''

  async function handleSubmit(data: FormData) {
    await onSubmit(data)
    setIsDialogOpen(false)
  }

  async function handleDialogChange(isOpen: boolean) {
    if (!isOpen) {
      const { image } = form.getValues()
      if (image && image !== initialImage) {
        await storageService.removeFile(ROCKETS_FOLDER, Text.create(image))
      }
      form.reset()
    }
    setIsDialogOpen(isOpen)
  }

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    rocketImage: form.watch('image'),
    isDialogOpen,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleDialogChange,
  }
}
