'use client'

import { useState } from 'react'

import { List } from '@stardust/core/global/structs'

import { useLessonStore } from '@/ui/lesson/stores/LessonStore'

export function useCheckboxQuestion() {
  const [userAnswers, setUserAnswers] = useState<List<string>>(List.create([]))
  const { getQuizSlice } = useLessonStore()
  const { quiz, setQuiz } = getQuizSlice()

  function handleCheckboxChange(checkedOption: string) {
    if (!quiz) return

    let newUserAnswers = userAnswers

    if (userAnswers.includes(checkedOption).isTrue) {
      newUserAnswers = userAnswers.remove(checkedOption)
    } else newUserAnswers = userAnswers.add(checkedOption)

    if (newUserAnswers.hasItems.isTrue) {
      setQuiz(quiz.changeUserAnswer(newUserAnswers.items))
    } else setQuiz(quiz.changeUserAnswer(null))

    setUserAnswers(newUserAnswers)
  }

  return {
    userAnswers,
    handleCheckboxChange,
  }
}
