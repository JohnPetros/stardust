import { useState } from 'react'

import { Text, type Id } from '@stardust/core/global/structures'
import type { LessonService } from '@stardust/core/lesson/interfaces'
import { useToast } from '@/ui/global/hooks/useToast'

export function useLessonStoryPage(
  lessonService: LessonService,
  starId: Id,
  defaultStory: string,
) {
  const [story, setStory] = useState(defaultStory)
  const [isStorySaving, setIsStorySaving] = useState(false)
  const [isStorySaved, setIsStorySaved] = useState(false)
  const [canSaveStory, setCanSaveStory] = useState(false)
  const [isStorySaveFailure, setIsStorySaveFailure] = useState(false)
  const toast = useToast()

  function handleStoryChange(value: string) {
    setStory(value)
    if (value) {
      setCanSaveStory(true)
    } else {
      setCanSaveStory(false)
    }

    setIsStorySaveFailure(false)
    setIsStorySaved(false)
  }

  async function handleSaveButtonClick() {
    setIsStorySaving(true)
    const response = await lessonService.updateStory(starId, Text.create(story))

    if (response.isFailure) {
      toast.showError(response.errorMessage)
      setIsStorySaveFailure(true)
    }

    if (response.isSuccessful) {
      toast.showSuccess('História salva com sucesso')
      setIsStorySaved(true)
    }

    setCanSaveStory(false)
    setIsStorySaving(false)
  }

  return {
    story,
    isStorySaving,
    isStorySaved,
    isStorySaveFailure,
    canSaveStory,
    handleSaveButtonClick,
    handleStoryChange,
  }
}
