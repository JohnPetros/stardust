import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import type { z } from 'zod'

import type { StorageService } from '@stardust/core/storage/interfaces'
import type { InsigniaDto } from '@stardust/core/shop/entities/dtos'
import { insigniaSchema } from '@stardust/validation/shop/schemas'
import { StorageFolder } from '@stardust/core/storage/structures'
import { Text } from '@stardust/core/global/structures'

const INSIGNIAS_FOLDER = StorageFolder.createAsInsignias()

type FormData = z.infer<typeof insigniaSchema>

type Params = {
  storageService: StorageService
  onSubmit: (data: FormData) => void
  initialValues?: InsigniaDto
}

export function useInsigniaForm({ storageService, initialValues, onSubmit }: Params) {
  const form = useForm<FormData>({
    resolver: zodResolver(insigniaSchema),
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const initialImage = initialValues?.image ?? ''

  async function handleSubmit(data: FormData) {
    if (initialValues?.id) {
      data.id = initialValues.id
    }
    onSubmit(data)
    form.reset()
    setIsDialogOpen(false)
  }

  async function handleDialogChange(isOpen: boolean) {
    if (!isOpen) {
      const { image } = form.getValues()
      if (image && image !== initialImage) {
        await storageService.removeFile(INSIGNIAS_FOLDER, Text.create(image))
      }
    }
    setIsDialogOpen(isOpen)
  }

  useEffect(() => {
    if (initialValues && isDialogOpen) {
      form.setValue('image', initialValues.image)
      form.setValue('name', initialValues.name)
      form.setValue('price', initialValues.price)
      form.setValue('role', initialValues.role as 'god' | 'engineer')
    }
  }, [initialValues, form, isDialogOpen])

  return {
    form,
    isDialogOpen,
    isSubmitting: form.formState.isSubmitting,
    insigniaImage: form.watch('image'),
    handleSubmit: form.handleSubmit(handleSubmit),
    handleDialogChange,
  }
}
