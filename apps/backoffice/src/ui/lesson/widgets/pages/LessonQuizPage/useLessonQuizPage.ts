import { useActionButtonStore } from '@/ui/global/stores/ActionButtonStore'
import type { Id } from '@stardust/core/global/structures'
import type { Question } from '@stardust/core/lesson/abstracts'
import type { LessonService } from '@stardust/core/lesson/interfaces'

export function useLessonQuizPage(
  lessonService: LessonService,
  starId: Id,
  questions: Question[],
) {
  const { useIsExecuting, useIsSuccessful, useIsFailure } = useActionButtonStore()
  const { setIsExecuting } = useIsExecuting()
  const { setIsSuccessful } = useIsSuccessful()
  const { setIsFailure } = useIsFailure()

  async function handleSaveButtonClick() {
    setIsExecuting(true)

    const response = await lessonService.updateQuestions(starId, questions)

    if (response.isSuccessful) {
      setIsSuccessful(true)
    } else {
      setIsFailure(true)
    }
  }

  return { handleSaveButtonClick }
}
