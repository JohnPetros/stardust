'use client'

import { useMemo } from 'react'

import { useLessonStore } from '@/ui/app/stores/LessonStore'

export function useDropZoneSlot() {
  const { getQuizSlice } = useLessonStore()
  const { quiz } = getQuizSlice()

  const borderColor = useMemo(() => {
    if (quiz?.userAnswer.isVerified.isTrue && quiz?.userAnswer.isCorrect.isTrue) {
      return 'border-green-400'
    }

    if (quiz?.userAnswer.isVerified.isTrue && quiz?.userAnswer.isCorrect.isFalse) {
      return 'border-red-700'
    }

    return 'border-gray-100'
  }, [quiz])

  return {
    borderColor,
  }
}
