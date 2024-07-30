import { useLessonStore } from '@/infra/stores/LessonStore'
import { useId, useMemo } from 'react'

export function useOption(isSelected: boolean) {
  const id = useId()
  const { quiz } = useLessonStore()

  const color: 'gray' | 'red' | 'blue' | 'green' = useMemo(() => {
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
    id,
    color,
  }
}
