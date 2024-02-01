'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'

import { useLessonStore } from '@/stores/lessonStore'
import { ROUTES } from '@/utils/constants'

export function useHeader() {
  const router = useRouter()

  const {
    mdxComponentsCount,
    questions,
    currentQuestionIndex,
    renderedMdxComponents,
  } = useLessonStore((store) => store.state)

  const total = mdxComponentsCount + questions.length
  const halfTotal = total / 2

  const currentProgressValue = useMemo(() => {
    if (!total) return 0

    return (
      (((renderedMdxComponents / mdxComponentsCount) * halfTotal) / total +
        ((currentQuestionIndex / questions.length) * halfTotal) / total) *
      100
    )
  }, [
    renderedMdxComponents,
    currentQuestionIndex,
    halfTotal,
    total,
    mdxComponentsCount,
    questions.length,
  ])

  function leaveLesson() {
    router.push(ROUTES.private.home.space)
  }

  return {
    leaveLesson,
    currentProgressValue,
  }
}
