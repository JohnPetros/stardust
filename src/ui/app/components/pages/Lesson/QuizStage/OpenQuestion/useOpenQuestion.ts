'use client'

import { useState } from 'react'

import { useLessonStore } from '@/infra/stores/LessonStore'

export function useOpenQuestion(answers: string[]) {
  const { getQuizSlice } = useLessonStore()
  const { quiz, setQuiz } = getQuizSlice()
  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array.from<string>({ length: answers.length }).fill(''),
  )

  function handleInputChange(value: string, index: number) {
    if (!quiz) return

    userAnswers[index] = value

    const currentUserAnswers = [...userAnswers]

    if (currentUserAnswers.length === answers.length) {
      setQuiz(quiz.changeUserAnswer(currentUserAnswers))
    }

    setUserAnswers(currentUserAnswers)
  }

  return {
    userAnswers,
    handleInputChange,
  }
}
