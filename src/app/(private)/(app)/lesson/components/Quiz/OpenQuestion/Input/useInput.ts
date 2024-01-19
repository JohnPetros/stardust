'use client'

import { useMemo } from 'react'

import { useLessonStore } from '@/stores/lessonStore'

export function useInput(answer: string) {
  const { isAnswerVerified, isAnswerCorrect } = useLessonStore(
    (store) => store.state
  )

  const width = 2.8 + answer.length + 'ch'

  const color: 'gray' | 'red' | 'green' = useMemo(() => {
    if (!isAnswerCorrect && isAnswerVerified) {
      return 'red'
    } else if (isAnswerCorrect && isAnswerVerified) {
      return 'green'
    } else {
      return 'gray'
    }
  }, [isAnswerCorrect, isAnswerVerified])

  return {
    width,
    color,
  }
}
