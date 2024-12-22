import { useMemo } from 'react'

import { useLessonStore } from '@/ui/lesson/stores/LessonStore'
import type { LabelColor } from './LabelColor'

export function useOption(isSelected: boolean) {
  const { getQuizSlice } = useLessonStore()
  const { quiz } = getQuizSlice()

  const labelColor: LabelColor = useMemo(() => {
    const isAnswerIncorrect =
      quiz?.userAnswer.isVerified.isTrue && quiz?.userAnswer.isCorrect.isFalse

    const isAnswerCorrect =
      quiz?.userAnswer.isVerified.isTrue && quiz?.userAnswer.isCorrect.isTrue

    if (isAnswerIncorrect && isSelected) {
      return 'red'
    }

    if (isAnswerCorrect) {
      return 'green'
    }

    if (isSelected) {
      return 'blue'
    }

    return 'gray'
  }, [quiz, isSelected])

  return {
    labelColor,
  }
}
