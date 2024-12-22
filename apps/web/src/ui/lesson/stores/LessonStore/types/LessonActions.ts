import type { Quiz, Theory } from '@stardust/core/lesson/structs'
import type { LessonStage } from '@stardust/core/lesson/types'

export type LessonActions = {
  setStage: (stage: LessonStage) => void
  setTheory: (theory: Theory) => void
  setQuiz: (quiz: Quiz) => void
  resetStore: () => void
}
