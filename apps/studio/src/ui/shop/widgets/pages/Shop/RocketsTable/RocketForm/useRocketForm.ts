import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import type { z } from 'zod'

import { rocketSchema } from '@stardust/validation/shop/schemas'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { StorageFolder } from '@stardust/core/storage/structures'
import { Text } from '@stardust/core/global/structures'

const ROCKETS_FOLDER = StorageFolder.createAsRockets()

type FormData = z.infer<typeof rocketSchema>

import type { RocketDto } from '@stardust/core/shop/entities/dtos'

type Params = {
  storageService: StorageService
  onSubmit: (data: FormData) => void
  initialValues?: RocketDto
}

export function useRocketForm({ storageService, onSubmit, initialValues }: Params) {
  const form = useForm<FormData>({
    resolver: zodResolver(rocketSchema),
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
        await storageService.removeFile(ROCKETS_FOLDER, Text.create(image))
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
    rocketImage: form.watch('image'),
    handleSubmit: form.handleSubmit(handleSubmit),
    handleDialogChange,
  }
}
