import { useEffect, useState } from 'react'

import { LessonProgress } from '@/@core/domain/structs'
import { useLessonStore } from '@/infra/stores/LessonStore'

export function useLessonHeader() {
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(null)
  const { theory, quiz } = useLessonStore()

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
