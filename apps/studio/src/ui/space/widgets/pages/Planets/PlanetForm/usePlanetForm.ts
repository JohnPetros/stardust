import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { nameSchema, stringSchema } from '@stardust/validation/global/schemas'
import type { PlanetDto } from '@stardust/core/space/entities/dtos'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { StorageFolder } from '@stardust/core/storage/structures'
import { Text } from '@stardust/core/global/structures'
import { useState } from 'react'

const PLANETS_FOLDER = StorageFolder.createAsPlanets()

const formSchema = z.object({
  name: nameSchema,
  icon: stringSchema,
  image: stringSchema,
})

type FormData = z.infer<typeof formSchema>

type Params = {
  planetDto?: PlanetDto
  storageService: StorageService
  onSubmit: (planetDto: Pick<PlanetDto, 'name' | 'icon' | 'image'>) => void
}

export function usePlanetForm({ planetDto, storageService, onSubmit }: Params) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: planetDto?.name,
      icon: planetDto?.icon,
      image: planetDto?.image,
    },
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function handleSubmit(data: FormData) {
    onSubmit({
      name: data.name,
      icon: data.icon,
      image: data.image,
    })
    setIsDialogOpen(false)
  }

  async function handleDialogChange(isOpen: boolean) {
    if (!isOpen) {
      const { image, icon } = form.getValues()
      if (image) await storageService.removeFile(PLANETS_FOLDER, Text.create(image))
      if (icon) await storageService.removeFile(PLANETS_FOLDER, Text.create(icon))
    }
    setIsDialogOpen(isOpen)
  }

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    planetImage: form.watch('image'),
    planetIcon: form.watch('icon'),
    isDialogOpen,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleDialogChange,
  }
}
