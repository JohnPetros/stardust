'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

import { useLessonStore } from '@/stores/lessonStore'
import { ROUTES } from '@/utils/constants'

export function useHeader() {
  const router = useRouter()

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

  function leaveLesson() {
    router.push(ROUTES.private.home)
  }

  return {
    leaveLesson,
    currentProgressValue,
  }
}
