'use client'

import { useState } from 'react'
import { useLessonStore } from '@/infra/stores/LessonStore'

export function useSelectionQuestion() {
  const [userAnswer, setUserAnswer] = useState<string | null>(null)
  const { quiz, setQuiz } = useLessonStore()

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
