import { type RefObject, useEffect } from 'react'

import type { AlertDialogRef } from '@/ui/global/components/shared/AlertDialog/types'
import { useLessonStore } from '@/ui/app/stores/LessonStore'

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
    if (quiz && !quiz.hasNextQuestion) {
      alert('REWARDS')
      setStage('rewards')
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
