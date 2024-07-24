import { useEffect, useState } from 'react'

import { LessonProgress } from '@/@core/domain/structs'
import { useLessonStore } from '@/infra/stores/LessonStore'

export function useLessonHeader() {
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(null)
  const { useTheory, useQuiz } = useLessonStore()
  const { theory } = useTheory()
  const { quiz } = useQuiz()

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
