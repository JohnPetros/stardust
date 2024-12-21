'use client'

import { useState } from 'react'
import { useLessonStore } from '@/ui/app/stores/LessonStore'

export function useSelectionQuestion() {
  const [userAnswer, setUserAnswer] = useState<string | null>(null)
  const { getQuizSlice } = useLessonStore()
  const { quiz, setQuiz } = getQuizSlice()

  function handleUserAnswerChange(userAnswer: string) {
    if (!quiz) return
    setUserAnswer(userAnswer)
    setQuiz(quiz.changeUserAnswer(userAnswer))
  }

  return {
    quiz,
    userAnswer,
    handleUserAnswerChange,
  }
}
