import type { Theory, Quiz } from '@/@core/domain/structs'
import type { LessonStage } from '@/@core/domain/types'

export type LessonActions = {
  setStage: (stage: LessonStage) => void
  setTheory: (theory: Theory) => void
  setQuiz: (quiz: Quiz) => void
  resetStore: () => void
}
