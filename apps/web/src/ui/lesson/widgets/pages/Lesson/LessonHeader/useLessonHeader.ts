import { useEffect, useState } from 'react'

import { LessonProgress } from '@stardust/core/lesson/structs'

import { useLessonStore } from '@/ui/lesson/stores/LessonStore'

export function useLessonHeader() {
  const [lessonProgress, setLessonProgress] = useState<LessonProgress | null>(null)
  const { getQuizSlice, getStorySlice } = useLessonStore()
  const { quiz } = getQuizSlice()
  const { story } = getStorySlice()

  useEffect(() => {
    if (story && quiz) {
      const lessonProgress = LessonProgress.create(story, quiz)
      setLessonProgress(lessonProgress)
    }
  }, [story, quiz])

  return {
    livesCount: quiz?.livesCount.value,
    lessonProgress,
  }
}
