import type { Id } from '@stardust/core/global/structures'
import type { Question } from '@stardust/core/lesson/abstracts'
import type { LessonService } from '@stardust/core/lesson/interfaces'

import { useToast } from '@/ui/global/hooks/useToastProvider'
import { useActionButtonStore } from '@/ui/global/stores/ActionButtonStore'

export function useQuizActionButton(
  lessonService: LessonService,
  starId: Id,
  questions: Question[],
) {
  const { useIsExecuting, useIsSuccessful, useIsFailure } = useActionButtonStore()
  const { setIsExecuting } = useIsExecuting()
  const { setIsSuccessful } = useIsSuccessful()
  const { setIsFailure } = useIsFailure()
  const { showError } = useToast()

  async function handleClick() {
    setIsExecuting(true)

    const response = await lessonService.updateQuestions(starId, questions)

    if (response.isSuccessful) {
      setIsSuccessful(true)
    }

    if (response.isFailure) {
      setIsFailure(true)
      showError(response.errorMessage)
    }

    setIsExecuting(false)
  }

  return {
    isDisabled: questions.length === 0,
    handleClick,
  }
}
