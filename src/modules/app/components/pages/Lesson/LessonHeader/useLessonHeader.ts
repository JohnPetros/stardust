import { useEffect, useState } from 'react'

import { LessonProgress } from '@/@core/domain/structs'
import { useLessonStore } from '@/infra/stores/LessonStore'

export function useLessonHeader() {
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(null)
  const { getQuizSlice, getTheorySlice, getStageSlice } = useLessonStore()
  const { quiz } = getQuizSlice()
  const { theory } = getTheorySlice()
  const { setStage } = getStageSlice()

  useEffect(() => {
    if (theory && quiz) {
      const lessonProgress = LessonProgress.create(theory, quiz)

      if (lessonProgress.isFull.isTrue) {
        setStage('rewards')
      }

      setLessonProgress(lessonProgress)
    }
  }, [theory, quiz, setStage])

  return {
    livesCount: quiz?.livesCount.value,
    lessonProgress,
  }
}
