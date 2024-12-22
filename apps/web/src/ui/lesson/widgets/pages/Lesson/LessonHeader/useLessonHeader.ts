import { useEffect, useState } from 'react'

import { LessonProgress } from '@stardust/core/lesson/structs'

import { useLessonStore } from '@/ui/lesson/stores/LessonStore'

export function useLessonHeader() {
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(null)
  const { getQuizSlice, getTheorySlice } = useLessonStore()
  const { quiz } = getQuizSlice()
  const { theory } = getTheorySlice()

  useEffect(() => {
    if (theory && quiz) {
      const lessonProgress = LessonProgress.create(theory, quiz)

      setLessonProgress(lessonProgress)
    }
  }, [theory, quiz])

  return {
    livesCount: quiz?.livesCount.value,
    lessonProgress,
  }
}
