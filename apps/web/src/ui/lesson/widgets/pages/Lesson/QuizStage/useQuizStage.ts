import { type RefObject, useEffect } from 'react'

import type { AlertDialogRef } from '@/ui/global/widgets/components/AlertDialog/types'
import { useLessonStore } from '@/ui/lesson/stores/LessonStore'

export function useQuizStage(alertDialogRef: RefObject<AlertDialogRef>) {
  const { getQuizSlice, getStageSlice } = useLessonStore()
  const { quiz, setQuiz } = getQuizSlice()
  const { setStage } = getStageSlice()

  function handleVerificationButtonClick() {
    if (!quiz) return

    const newQuiz = quiz.verifyUserAnswer()
    setQuiz(newQuiz)
  }

  useEffect(() => {
    if (quiz?.hasNextQuestion.isFalse) {
      setStage('rewarding')
      return
    }

    if (quiz && !quiz.hasLives) alertDialogRef.current?.open()
  }, [quiz, alertDialogRef, setStage])

  return {
    quiz,
    handleVerificationButtonClick,
    setStage,
  }
}
