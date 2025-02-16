'use client'

import { useMemo } from 'react'
import { useLessonStore } from '@/ui/lesson/stores/LessonStore'

export function useItem(itemLabel: string, isActive: boolean, isInSlot: boolean) {
  const { getQuizSlice } = useLessonStore()
  const { quiz } = getQuizSlice()

  const width = useMemo(() => {
    const { length } = itemLabel
    const base = length < 10 ? 2.5 : 3
    return `${base + length / 2}rem`
  }, [itemLabel])

  const textColor = useMemo(() => {
    if (
      quiz?.userAnswer.isVerified.isTrue &&
      quiz.userAnswer.isCorrect.isTrue &&
      isInSlot
    ) {
      return 'text-green-400'
    }

    if (
      quiz?.userAnswer.isVerified.isTrue &&
      quiz?.userAnswer.isCorrect.isFalse &&
      isInSlot
    ) {
      return 'text-red-700'
    }

    return 'text-gray-100'
  }, [quiz, isInSlot])

  const border = useMemo(() => {
    if (
      quiz?.userAnswer.isVerified.isTrue &&
      quiz.userAnswer.isCorrect.isTrue &&
      isInSlot
    ) {
      return 'border-green-400'
    }

    if (
      quiz?.userAnswer.isVerified.isTrue &&
      quiz.userAnswer.isCorrect.isFalse &&
      isInSlot
    ) {
      return 'border-red-700'
    }

    if (isActive && isInSlot) {
      return 'border-none bg-transparent p-0'
    }

    if (isActive) {
      return 'border-2 border-blue-300 text-blue-300 cursor-grab'
    }

    return 'border-gray-10 p-1'
  }, [quiz, isActive, isInSlot])

  return {
    width,
    textColor,
    border,
  }
}
