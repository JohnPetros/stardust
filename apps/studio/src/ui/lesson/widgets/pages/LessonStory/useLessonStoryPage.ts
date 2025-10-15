import { useState } from 'react'

import type { LessonService } from '@stardust/core/lesson/interfaces'
import { Text, type Id } from '@stardust/core/global/structures'

import { useToast } from '@/ui/global/hooks/useToastProvider'
import { useActionButtonStore } from '@/ui/global/stores/ActionButtonStore'

export function useLessonStoryPage(
  lessonService: LessonService,
  starId: Id,
  defaultStory: string,
) {
  const [story, setStory] = useState(defaultStory)
  const { useIsExecuting, useIsSuccessful, useIsFailure, useCanExecute } =
    useActionButtonStore()
  const { setIsExecuting } = useIsExecuting()
  const { setIsSuccessful } = useIsSuccessful()
  const { setIsFailure } = useIsFailure()
  const { setCanExecute } = useCanExecute()
  const toast = useToast()

  function handleStoryChange(value: string) {
    setStory(value)
    if (value) {
      setCanExecute(true)
    } else {
      setCanExecute(false)
    }

    setIsFailure(false)
    setIsSuccessful(false)
  }

  async function handleSaveButtonClick() {
    setIsExecuting(true)
    const response = await lessonService.updateStory(starId, Text.create(story))

    if (response.isFailure) {
      toast.showError(response.errorMessage)
      setIsFailure(true)
    }

    if (response.isSuccessful) {
      setIsSuccessful(true)
    }

    setCanExecute(false)
    setIsExecuting(false)
  }

  return {
    story,
    handleSaveButtonClick,
    handleStoryChange,
  }
}
