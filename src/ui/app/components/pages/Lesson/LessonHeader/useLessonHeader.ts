import { useEffect, useState } from 'react'

import { LessonProgress } from '@/@core/domain/structs'
import { useLessonStore } from '@/ui/app/stores/LessonStore'

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
