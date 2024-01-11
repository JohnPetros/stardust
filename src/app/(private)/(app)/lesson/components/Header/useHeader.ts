'use client'

import { useMemo } from 'react'

import { useLessonStore } from '@/stores/lessonStore'

export function useHeader() {
  const { texts, questions, currentQuestionIndex, renderedTextsAmount } =
    useLessonStore((store) => store.state)

  const total = texts.length + questions.length
  const halfTotal = total / 2

  const currentProgressValue = useMemo(() => {
    if (!total) return 0

    return (
      (((renderedTextsAmount / texts.length) * halfTotal) / total +
        ((currentQuestionIndex / questions.length) * halfTotal) / total) *
      100
    )
  }, [
    renderedTextsAmount,
    currentQuestionIndex,
    halfTotal,
    total,
    texts.length,
    questions.length,
  ])

  return {
    currentProgressValue,
  }
}
