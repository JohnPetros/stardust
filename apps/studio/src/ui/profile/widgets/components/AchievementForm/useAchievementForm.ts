import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import type { z } from 'zod'

import { achievementSchema } from '@stardust/validation/profile/schemas'
import type { StorageService } from '@stardust/core/storage/interfaces'
import { StorageFolder } from '@stardust/core/storage/structures'
import { Text } from '@stardust/core/global/structures'
import type { AchievementDto } from '@stardust/core/profile/entities/dtos'
import type { AchievementMetricValue } from '@stardust/core/profile/types'

const ACHIEVEMENTS_FOLDER = StorageFolder.createAsAchievements()

const formSchema = achievementSchema.omit({ id: true, position: true })

type FormData = z.infer<typeof formSchema>

type Params = {
  achievementDto?: AchievementDto
  storageService: StorageService
  onSubmit: (data: FormData) => void
}

export function useAchievementForm({ achievementDto, storageService, onSubmit }: Params) {
  const initialIcon = achievementDto?.icon || ''
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: achievementDto?.name || '',
      icon: initialIcon,
      description: achievementDto?.description || '',
      reward: achievementDto?.reward || 0,
      requiredCount: achievementDto?.requiredCount || 0,
      metric: achievementDto?.metric
        ? (achievementDto.metric as AchievementMetricValue)
        : 'unlockedStarsCount',
    },
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  function handleSubmit(data: FormData) {
    onSubmit(data)
    setIsDialogOpen(false)
  }

  async function handleDialogChange(isOpen: boolean) {
    if (!isOpen) {
      const { icon } = form.getValues()
      if (icon && icon !== initialIcon) {
        await storageService.removeFile(ACHIEVEMENTS_FOLDER, Text.create(icon))
      }
      form.reset()
    }
    setIsDialogOpen(isOpen)
  }

  return {
    form,
    isSubmitting: form.formState.isSubmitting,
    achievementIcon: form.watch('icon'),
    isDialogOpen,
    isEditMode: !!achievementDto,
    handleSubmit: form.handleSubmit(handleSubmit),
    handleDialogChange,
  }
}
