import { type RefObject, useEffect } from 'react'

import type { AlertDialogRef } from '@/ui/global/components/shared/AlertDialog/types'
import { useLessonStore } from '@/infra/stores/LessonStore'

export function useQuizStage(alertDialogRef: RefObject<AlertDialogRef>) {
  const { getQuizSlice } = useLessonStore()
  const { quiz, setQuiz } = getQuizSlice()

  function handleVerificationButtonClick() {
    if (!quiz) return

    const newQuiz = quiz.verifyUserAnswer()
    setQuiz(newQuiz)
  }

  useEffect(() => {
    if (quiz && !quiz.hasLives) alertDialogRef.current?.open()
  }, [quiz, alertDialogRef])

  return {
    quiz,
    handleVerificationButtonClick,
  }
}
