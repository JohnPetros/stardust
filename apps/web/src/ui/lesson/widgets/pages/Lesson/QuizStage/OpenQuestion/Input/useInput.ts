'use client'

import { useMemo } from 'react'

import { useLessonStore } from '@/ui/lesson/stores/LessonStore'
import type { InputBackground } from './InputBackground'

export function useInput(answer: string) {
  const { getQuizSlice } = useLessonStore()
  const { quiz } = getQuizSlice()

  const width = `${2.8 + answer.length}ch`

  const background: InputBackground = useMemo(() => {
    if (quiz?.userAnswer.isCorrect.isFalse && quiz?.userAnswer.isVerified.isTrue) {
      return 'red'
    }

    if (quiz?.userAnswer.isCorrect.isTrue && quiz?.userAnswer.isVerified.isTrue) {
      return 'green'
    }

    return 'gray'
  }, [quiz])

  return {
    width,
    background,
  }
}
